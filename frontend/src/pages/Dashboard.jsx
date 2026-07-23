import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, MessagesSquare, ArrowUpRight, Plus } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import SpotlightCard from "../components/SpotlightCard";
import ScoreGauge from "../components/ScoreGauge";

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, s] = await Promise.all([api.get("/resumes"), api.get("/interviews")]);
        setResumes(r.data.data);
        setSessions(s.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader fullScreen />;

  const latestResume = resumes[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-signal-light">Dashboard</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-mist-100">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/resume-analyzer"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-dark transition-colors"
          >
            <Plus className="h-4 w-4" /> New scan
          </Link>
          <Link
            to="/interview-prep"
            className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-5 py-2.5 text-sm text-mist-200 hover:border-signal/50 transition-colors"
          >
            <Plus className="h-4 w-4" /> Mock interview
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-14">
        <SpotlightCard className="p-6 flex items-center gap-5">
          {latestResume ? (
            <ScoreGauge score={latestResume.atsScore} size={100} />
          ) : (
            <div className="h-[100px] w-[100px] flex items-center justify-center rounded-full border border-dashed border-ink-600 font-mono text-xs text-mist-400">
              N/A
            </div>
          )}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-mist-400">Latest ATS score</p>
            <p className="mt-1 text-sm text-mist-300">
              {latestResume ? latestResume.fileName : "Upload a resume to see your score"}
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <FileText className="h-6 w-6 text-signal-light mb-3" />
          <p className="font-display text-2xl font-bold text-mist-100">{resumes.length}</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-mist-400 mt-1">
            Resumes analyzed
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <MessagesSquare className="h-6 w-6 text-signal-light mb-3" />
          <p className="font-display text-2xl font-bold text-mist-100">{sessions.length}</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-mist-400 mt-1">
            Mock interviews run
          </p>
        </SpotlightCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="font-display text-lg font-semibold text-mist-100 mb-4">Resume history</h2>
          <div className="space-y-3">
            {resumes.length === 0 && (
              <p className="text-sm text-mist-400">No resumes analyzed yet.</p>
            )}
            {resumes.map((r) => (
              <Link
                key={r._id}
                to={`/resume-analyzer?id=${r._id}`}
                className="flex items-center justify-between rounded-xl border border-ink-600 bg-ink-800/40 px-5 py-4 hover:border-signal/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-mist-100">{r.fileName}</p>
                  <p className="text-xs text-mist-400 mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.targetRole || "General"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-signal-light">{r.atsScore}</span>
                  <ArrowUpRight className="h-4 w-4 text-mist-400" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-mist-100 mb-4">Interview sessions</h2>
          <div className="space-y-3">
            {sessions.length === 0 && (
              <p className="text-sm text-mist-400">No mock interviews yet.</p>
            )}
            {sessions.map((s) => (
              <Link
                key={s._id}
                to={`/interview-prep?id=${s._id}`}
                className="flex items-center justify-between rounded-xl border border-ink-600 bg-ink-800/40 px-5 py-4 hover:border-signal/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-mist-100">{s.role}</p>
                  <p className="text-xs text-mist-400 mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString()} · {s.experienceLevel}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-mist-400" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
