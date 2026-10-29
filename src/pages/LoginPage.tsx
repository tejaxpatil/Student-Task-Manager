import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authenticateUser, getLastRegisteredEmail } from "../utils/userStorage";

interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    registeredEmail?: string;
    successNotice?: string;
    from?: string;
  } | null;

  const initialEmail = state?.registeredEmail || getLastRegisteredEmail();

  const [values, setValues] = useState<FormValues>({
    email: initialEmail,
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: keyof FormValues, val: string): string | undefined => {
    switch (name) {
      case "email": {
        const trimmed = val.trim();
        if (!trimmed) return "Email address is required.";
        if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address (e.g. you@example.com).";
        return undefined;
      }
      case "password": {
        if (!val) return "Password is required.";
        if (val.length < 6) return "Password must be at least 6 characters long.";
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const validateAll = (data: FormValues): FormErrors => {
    const newErrors: FormErrors = {};
    (Object.keys(data) as Array<keyof FormValues>).forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormValues;
    const updatedValues = { ...values, [fieldName]: value };
    setValues(updatedValues);
    setAuthError(null);

    if (touched[fieldName]) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormValues;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleFillDemo = () => {
    setValues({
      email: "student@example.com",
      password: "student123",
    });
    setErrors({});
    setAuthError(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);

    setTouched({ email: true, password: true });

    const validationErrors = validateAll(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const result = authenticateUser({
      email: values.email,
      password: values.password,
    });

    if (!result.success) {
      setIsSubmitting(false);
      setAuthError(result.error || "Authentication failed. Please verify your credentials.");
      return;
    }

    // Login successful
    setIsSuccess(true);
    setIsSubmitting(false);

    // Redirect to destination or dashboard
    const destination = state?.from || "/dashboard";
    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 1200);
  };

  return (
    <section className="mx-auto grid min-h-[65vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      {/* Left side banner */}
      <div className="hidden rounded-3xl bg-slate-900 p-10 text-white lg:block">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Welcome back</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Pick up where you left off.</h1>
        <p className="mt-4 max-w-md leading-7 text-slate-300">Your plans, priorities, and next steps are waiting for you.</p>
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">S</span>
          <div>
            <p className="font-semibold">Student Task Manager</p>
            <p className="text-sm text-slate-300">Make room for what matters</p>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="mx-auto w-full max-w-md">
        {/* STM-10: Authentication and input validation by Thalesh */}
        <p className="text-sm font-semibold text-blue-700">YOUR WORKSPACE</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Log in to your account</h2>
        <p className="mt-2 text-slate-600">Enter your credentials to continue.</p>

        {/* Success Notice from Registration / Destination */}
        {state?.successNotice && !authError && !isSuccess && (
          <div role="status" className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">✓</span>
              <div>
                <p className="font-semibold">Account ready</p>
                <p className="mt-1 text-sm text-green-700">{state.successNotice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Success Alert */}
        {isSuccess && (
          <div role="status" className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">✓</span>
              <div>
                <p className="font-semibold">Login successful!</p>
                <p className="mt-1 text-sm text-green-700">Redirecting to your student dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Error Alert */}
        {authError && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">!</span>
              <div>
                <p className="font-semibold text-red-800">Login error</p>
                <p className="mt-1 text-sm text-red-700">{authError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Demo Fill Helper */}
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold">Demo credentials:</span> student@example.com / student123
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="shrink-0 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Fill Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          {/* Email field */}
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSuccess || isSubmitting}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.email && (
              <p id="login-email-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <span aria-hidden="true">⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSuccess || isSubmitting}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.password && (
              <p id="login-password-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <span aria-hidden="true">⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : isSuccess ? "Success ✓" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{" "}
          <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
