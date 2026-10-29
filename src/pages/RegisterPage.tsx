import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/userStorage";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation functions
  const validateField = (name: keyof FormValues, val: string, allValues = values): string | undefined => {
    switch (name) {
      case "name": {
        const trimmed = val.trim();
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 2) return "Full name must be at least 2 characters.";
        return undefined;
      }
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
      case "confirmPassword": {
        if (!val) return "Please confirm your password.";
        if (val !== allValues.password) return "Passwords do not match.";
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const validateAll = (data: FormValues): FormErrors => {
    const newErrors: FormErrors = {};
    (Object.keys(data) as Array<keyof FormValues>).forEach((field) => {
      const error = validateField(field, data[field], data);
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
    setGeneralError(null);

    // Revalidate field on change if it has already been touched
    if (touched[fieldName]) {
      const fieldError = validateField(fieldName, value, updatedValues);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }

    // Special case: if changing password, revalidate confirmPassword if touched
    if (fieldName === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", values.confirmPassword, updatedValues);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormValues;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value, values);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const validationErrors = validateAll(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Execute user registration persistence
    const result = registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (!result.success) {
      setIsSubmitting(false);
      setGeneralError(result.error || "Registration failed. Please check your information and try again.");
      return;
    }

    // Registration succeeded
    setIsSuccess(true);
    setIsSubmitting(false);

    // Automatically redirect to login after short delay
    setTimeout(() => {
      navigate("/login", {
        state: {
          registeredEmail: values.email.trim(),
          successNotice: "Account created successfully! Please log in with your credentials.",
        },
      });
    }, 1800);
  };

  return (
    <section className="mx-auto grid min-h-[65vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      {/* Left side banner */}
      <div className="hidden rounded-3xl bg-blue-600 p-10 text-white lg:block">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Get organized</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Make space for your next big thing.</h1>
        <p className="mt-4 max-w-md leading-7 text-blue-100">
          Create your student account to get started with a more organized semester.
        </p>
        <div className="mt-10 rounded-2xl bg-white/10 p-5">
          <p className="text-lg font-semibold">One place for your plans.</p>
          <p className="mt-1 text-sm text-blue-100">Your goals start with a clear next step.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="mx-auto w-full max-w-md">
        {/* STM-7: Registration implementation and input validation by Thalesh */}
        <p className="text-sm font-semibold text-blue-700">CREATE YOUR ACCOUNT</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Join Student Task Manager</h2>
        <p className="mt-2 text-slate-600">Enter your details to get started.</p>

        {/* Success Alert */}
        {isSuccess && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                ✓
              </span>
              <div>
                <p className="font-semibold">Account created successfully!</p>
                <p className="mt-1 text-sm text-green-700">
                  Redirecting to login page... or{" "}
                  <Link to="/login" className="font-bold underline hover:text-green-900">
                    click here to log in now
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global/Server Error Alert */}
        {generalError && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                !
              </span>
              <div>
                <p className="font-semibold text-red-800">Registration problem</p>
                <p className="mt-1 text-sm text-red-700">{generalError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSuccess || isSubmitting}
              placeholder="Your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.name && (
              <p id="register-name-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <span aria-hidden="true">⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSuccess || isSubmitting}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.email && (
              <p id="register-email-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <span aria-hidden="true">⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
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
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSuccess || isSubmitting}
              placeholder="At least 6 characters"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.password ? (
              <p id="register-password-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <span aria-hidden="true">⚠</span> {errors.password}
              </p>
            ) : (
              <p id="register-password-hint" className="mt-1.5 text-xs text-slate-500">
                Must be at least 6 characters long.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSuccess || isSubmitting}
              placeholder="Re-enter your password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.confirmPassword && (
              <p id="register-confirm-password-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <span aria-hidden="true">⚠</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : isSuccess ? "Account created ✓" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
