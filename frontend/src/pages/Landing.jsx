import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanLine, Target, MessagesSquare, FileCheck2, ArrowRight, Sparkles } from "lucide-react";
import ResumeScannerMockup from "../components/ResumeScannerMockup";
import SpotlightCard from "../components/SpotlightCard";

const features = [
  {
    icon: ScanLine,
    title: "ATS Resume Scan",
    desc: "Upload a PDF and get an instant ATS-compatibility score with line-by-line rewrite suggestions.",
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    desc: "Gemini compares your resume against your target role and flags exactly what's missing.",
  },
  {
    icon: MessagesSquare,
    title: "Mock Interview Questions",
    desc: "Get personalized technical, behavioral, and role-specific questions — then score your own answers.",
  },
  {
    icon: FileCheck2,
    title: "Bullet Point Rewriter",
    desc: "Weak, vague bullets get rewritten into quantified, recruiter-ready achievements.",
  },
];

const steps = [
  { label: "Upload", desc: "Drop in your resume as a PDF." },
  { label: "Analyze", desc: "Gemini reads it like a recruiter and an ATS bot at once." },
  { label: "Improve", desc: "Apply fixes, close skill gaps, rehearse interview answers." },
];

const Landing = () => {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="absolute inset-0 bg-grid bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-signal-light">
            <Sparkles className="h-3 w-3" /> Powered by Google Gemini
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-mist-100">
            Your resume, read the way{" "}
            <span className="text-gradient">an ATS bot actually reads it.</span>
          </h1>
          <p className="mt-5 max-w-lg text-mist-400 leading-relaxed">
            NextHire scans your resume for keyword gaps, formatting issues, and weak bullet points —
            then builds a personalized mock interview around your real skill set.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(124,92,252,0.5)] hover:bg-signal-dark transition-colors"
            >
              Scan your resume free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="text-sm text-mist-300 hover:text-mist-100 transition-colors font-mono uppercase tracking-widest"
            >
              Sign in →
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-8 font-mono text-xs text-mist-400">
            <div>
              <div className="text-xl font-display font-semibold text-mist-100">100%</div>
              free during beta
            </div>
            <div className="h-8 w-px bg-ink-600" />
            <div>
              <div className="text-xl font-display font-semibold text-mist-100">&lt; 30s</div>
              per full analysis
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="animate-floatSlow"
        >
          <ResumeScannerMockup />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-signal-light">What it does</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-mist-100">
            Four tools, one prep loop
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f) => (
            <SpotlightCard key={f.title} className="p-7">
              <f.icon className="h-6 w-6 text-signal-light mb-4" strokeWidth={1.8} />
              <h3 className="font-display text-lg font-semibold text-mist-100 mb-2">{f.title}</h3>
              <p className="text-sm text-mist-400 leading-relaxed">{f.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <span className="font-mono text-xs uppercase tracking-widest text-signal-light">Process</span>
        <h2 className="mt-3 mb-12 font-display text-3xl font-bold text-mist-100">
          From upload to offer-ready
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.label} className="relative rounded-2xl border border-ink-600 bg-ink-800/40 p-7">
              <span className="font-mono text-4xl font-bold text-ink-600">0{i + 1}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-mist-100">{s.label}</h3>
              <p className="mt-2 text-sm text-mist-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-mist-100">
          Stop guessing what recruiters see.
        </h2>
        <p className="mt-4 text-mist-400">Create a free account and run your first scan in under a minute.</p>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_30px_rgba(124,92,252,0.5)] hover:bg-signal-dark transition-colors"
        >
          Get started free <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default Landing;
