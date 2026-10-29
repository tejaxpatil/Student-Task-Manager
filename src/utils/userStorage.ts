export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const USERS_STORAGE_KEY = "stm_registered_users";
const CURRENT_USER_KEY = "stm_current_user";
const LAST_REGISTERED_EMAIL_KEY = "stm_last_registered_email";

// Default demo account for presentations & grading
const DEFAULT_DEMO_USER: RegisteredUser = {
  id: "user_demo_default",
  name: "Alex Morgan",
  email: "student@example.com",
  password: "student123",
  createdAt: "2026-01-15T08:00:00.000Z",
};

/**
 * Retrieves the list of registered users from localStorage.
 */
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const rawData = localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawData) {
      // Seed with default demo user so reviewer can test login immediately
      const initialUsers = [DEFAULT_DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const parsed = JSON.parse(rawData) as RegisteredUser[];
    // Ensure default demo user exists
    if (!parsed.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
      parsed.unshift(DEFAULT_DEMO_USER);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Failed to read registered users from localStorage:", err);
    return [DEFAULT_DEMO_USER];
  }
}

/**
 * Finds a registered user by email (case-insensitive).
 */
export function findUserByEmail(email: string): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

/**
 * Registers a new user. Validates uniqueness of email and persists to localStorage.
 */
export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; error?: string; user?: RegisteredUser } {
  const normalizedEmail = data.email.trim().toLowerCase();
  const trimmedName = data.name.trim();

  // Check for duplicate account
  const existingUser = findUserByEmail(normalizedEmail);
  if (existingUser) {
    return {
      success: false,
      error: "An account with this email address already exists. Please log in instead.",
    };
  }

  const newUser: RegisteredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: trimmedName,
    email: normalizedEmail,
    password: data.password,
    createdAt: new Date().toISOString(),
  };

  try {
    const currentUsers = getRegisteredUsers();
    currentUsers.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(currentUsers));
    localStorage.setItem(LAST_REGISTERED_EMAIL_KEY, normalizedEmail);
    return { success: true, user: newUser };
  } catch (err) {
    console.error("Failed to persist new user to localStorage:", err);
    return {
      success: false,
      error: "Unable to save user data. Please ensure local storage is enabled.",
    };
  }
}

/**
 * Authenticates a user against registered users in localStorage.
 */
export function authenticateUser(credentials: {
  email: string;
  password: string;
}): { success: boolean; error?: string; user?: RegisteredUser } {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const user = findUserByEmail(normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: "No account found with this email address. Please check your spelling or create an account.",
    };
  }

  if (user.password !== credentials.password) {
    return {
      success: false,
      error: "Incorrect password. Please verify your password and try again.",
    };
  }

  // Authentication successful - persist session
  setCurrentUser(user);
  return { success: true, user };
}

/**
 * Retrieves the currently logged-in user session.
 */
export function getCurrentUser(): RegisteredUser | null {
  try {
    const rawData = localStorage.getItem(CURRENT_USER_KEY);
    if (!rawData) return null;
    return JSON.parse(rawData) as RegisteredUser;
  } catch {
    return null;
  }
}

/**
 * Sets the active user session and notifies listeners.
 */
export function setCurrentUser(user: RegisteredUser): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("stm_auth_changed"));
  } catch (err) {
    console.error("Failed to persist current user session:", err);
  }
}

/**
 * Logs out the active user and clears session.
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event("stm_auth_changed"));
  } catch (err) {
    console.error("Failed to log out user:", err);
  }
}

/**
 * Retrieves the most recently registered email address (used for prefilling login).
 */
export function getLastRegisteredEmail(): string {
  try {
    return localStorage.getItem(LAST_REGISTERED_EMAIL_KEY) || "";
  } catch {
    return "";
  }
}
