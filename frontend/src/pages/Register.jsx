import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Radar, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", targetRole: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal/15 border border-signal/40 mb-4">
            <Radar className="h-5 w-5 text-signal-light" />
          </div>
          <h1 className="font-display text-2xl font-bold text-mist-100">Create your account</h1>
          <p className="mt-1 text-sm text-mist-400">Start scanning resumes in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Full name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60 transition-colors"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Target role <span className="normal-case text-mist-400/60">(optional)</span>
            </label>
            <input
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60 transition-colors"
              placeholder="Frontend Engineer"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60 transition-colors"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-signal py-3 text-sm font-medium text-white hover:bg-signal-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-400">
          Already have an account?{" "}
          <Link to="/login" className="text-signal-light hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
