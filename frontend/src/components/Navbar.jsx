import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Radar, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/resume-analyzer", label: "Resume Scan" },
        { to: "/interview-prep", label: "Interview Prep" },
      ]
    : [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-900/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-signal/15 border border-signal/40">
            <Radar className="h-4 w-4 text-signal-light" strokeWidth={2.2} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-mist-100">
            Next<span className="text-signal-light">Hire</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                location.pathname === l.to
                  ? "text-signal-light"
                  : "text-mist-400 hover:text-mist-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2 text-sm text-mist-200 hover:border-signal/50 hover:text-signal-light transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm text-mist-200 hover:text-mist-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-signal px-5 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(124,92,252,0.45)] hover:bg-signal-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-mist-100" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink-700/60 px-6 py-4 flex flex-col gap-4 bg-ink-900">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-mist-200 text-sm">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-left text-sm text-scan">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-mist-200">
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-full bg-signal px-4 py-2 text-sm text-white w-fit"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
