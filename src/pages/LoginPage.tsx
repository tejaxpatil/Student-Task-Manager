import { Link, useLocation } from "react-router-dom";
import { getLastRegisteredEmail } from "../utils/userStorage";

export default function LoginPage() {
  const location = useLocation();
  const state = location.state as { registeredEmail?: string; successNotice?: string } | null;
  const initialEmail = state?.registeredEmail || getLastRegisteredEmail();

  return (
    <section className="mx-auto grid min-h-[65vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div className="hidden rounded-3xl bg-slate-900 p-10 text-white lg:block">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Welcome back</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Pick up where you left off.</h1>
        <p className="mt-4 max-w-md leading-7 text-slate-300">Your plans, priorities, and next steps are waiting for you.</p>
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">S</span><div><p className="font-semibold">Student Task Manager</p><p className="text-sm text-slate-300">Make room for what matters</p></div></div>
      </div>
      <div className="mx-auto w-full max-w-md">
        {/* STM-9: UI only. Thalesh owns authentication logic in STM-10. */}
        <p className="text-sm font-semibold text-blue-700">YOUR WORKSPACE</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Log in to your account</h2>
        <p className="mt-2 text-slate-600">Enter your credentials to continue.</p>

        {state?.successNotice && (
          <div role="status" className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">✓</span>
              <div>
                <p className="font-semibold">Ready to log in</p>
                <p className="mt-1 text-sm text-green-700">{state.successNotice}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-5">
          <div><label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label><input id="login-email" name="email" type="email" defaultValue={initialEmail} autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
          <div><label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-700">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
          <button type="button" className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">Log in</button>
          <p className="text-xs leading-5 text-slate-500">Authentication, invalid-credential messages, and protected routes are handled in the implementation task.</p>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">New here? <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">Create an account</Link></p>
      </div>
    </section>
  );
}
