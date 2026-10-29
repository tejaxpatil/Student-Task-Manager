export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const USERS_STORAGE_KEY = "stm_registered_users";
const LAST_REGISTERED_EMAIL_KEY = "stm_last_registered_email";

/**
 * Retrieves the list of registered users from localStorage.
 */
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const rawData = localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawData) return [];
    return JSON.parse(rawData) as RegisteredUser[];
  } catch (err) {
    console.error("Failed to read registered users from localStorage:", err);
    return [];
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
    password: data.password, // Frontend demo storage
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
 * Retrieves the most recently registered email address (used for prefilling login).
 */
export function getLastRegisteredEmail(): string {
  try {
    return localStorage.getItem(LAST_REGISTERED_EMAIL_KEY) || "";
  } catch {
    return "";
  }
}
