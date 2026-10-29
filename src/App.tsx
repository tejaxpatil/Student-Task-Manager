import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUser, logoutUser, type RegisteredUser } from "./utils/userStorage";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("stm_auth_changed", handleAuthChange);
    return () => window.removeEventListener("stm_auth_changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-3" aria-label="Student Task Manager home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-lg font-bold text-white">S</span>
            <span>
              <span className="block text-base font-bold tracking-tight">Student Task Manager</span>
              <span className="hidden text-xs text-slate-500 sm:block">Make room for what matters</span>
            </span>
          </NavLink>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Main navigation">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
            {currentUser ? (
              <>
                <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
                <div className="ml-2 flex items-center gap-2">
                  <span className="hidden text-xs font-semibold text-slate-600 sm:inline">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>Log in</NavLink>
                <NavLink to="/register" className="ml-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Get started</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Page not found</h1><p className="mt-2 text-slate-600">The page you requested does not exist.</p><NavLink className="mt-5 inline-block font-semibold text-blue-700" to="/">Return home</NavLink></div>} />
        </Routes>
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Student Task Manager</p>
          <p>Built as a team project for Software Project Management.</p>
        </div>
      </footer>
    </div>
  );
}
