import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MessagesSquare, Sparkles, Send, Star } from "lucide-react";
import api from "../services/api";
import Loader from "../components/Loader";
import SpotlightCard from "../components/SpotlightCard";

const categoryColor = {
  technical: "text-signal-light border-signal/40 bg-signal/10",
  behavioral: "text-scan border-scan/40 bg-scan/10",
  situational: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  "role-specific": "text-rose-300 border-rose-300/40 bg-rose-300/10",
};

const InterviewPrep = () => {
  const [params] = useSearchParams();
  const [resumes, setResumes] = useState([]);
  const [form, setForm] = useState({ role: "", experienceLevel: "junior", resumeId: "" });
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(false);

  useEffect(() => {
    api.get("/resumes").then((res) => setResumes(res.data.data));
  }, []);

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      setLoadingExisting(true);
      api
        .get(`/interviews/${id}`)
        .then((res) => setSession(res.data.data))
        .catch(() => toast.error("Could not load that session"))
        .finally(() => setLoadingExisting(false));
    }
  }, [params]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error("Please enter a target role");
    setGenerating(true);
    try {
      const res = await api.post("/interviews/generate", form);
      setSession(res.data.data);
      toast.success("Questions ready!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate questions");
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    const answer = answers[questionId];
    if (!answer?.trim()) return toast.error("Write an answer first");
    setSubmittingId(questionId);
    try {
      const res = await api.post(`/interviews/${session._id}/answer`, { questionId, answer });
      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => (q._id === questionId ? res.data.data : q)),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not score answer");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loadingExisting) return <Loader fullScreen />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-signal-light">Interview prep</span>
      <h1 className="mt-2 mb-8 font-display text-3xl font-bold text-mist-100">Personalized Mock Interview</h1>

      {!session && (
        <form onSubmit={handleGenerate} className="rounded-2xl border border-ink-600 bg-ink-800/40 p-8 space-y-5">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Target role
            </label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Backend Engineer"
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Experience level
            </label>
            <div className="flex flex-wrap gap-2">
              {["fresher", "junior", "mid", "senior"].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setForm({ ...form, experienceLevel: lvl })}
                  className={`rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wide border transition-colors ${
                    form.experienceLevel === lvl
                      ? "border-signal bg-signal/15 text-signal-light"
                      : "border-ink-600 text-mist-400 hover:border-ink-600/80"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          {resumes.length > 0 && (
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
                Base on a resume <span className="normal-case text-mist-400/60">(optional)</span>
              </label>
              <select
                value={form.resumeId}
                onChange={(e) => setForm({ ...form, resumeId: e.target.value })}
                className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60"
              >
                <option value="">None — general questions</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={generating}
            className="flex items-center gap-2 rounded-full bg-signal px-7 py-3 text-sm font-medium text-white hover:bg-signal-dark transition-colors disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating questions..." : "Generate interview"}
          </button>
        </form>
      )}

      {generating && <Loader label="Building your mock interview" />}

      {session && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-mist-300">
            <MessagesSquare className="h-4 w-4 text-signal-light" />
            <span className="text-sm">
              {session.role} · {session.experienceLevel}
            </span>
          </div>

          {session.questions.map((q, i) => (
            <SpotlightCard key={q._id} className="p-7">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="font-medium text-mist-100">
                  <span className="text-mist-400 font-mono text-sm mr-2">Q{i + 1}.</span>
                  {q.question}
                </p>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase ${
                    categoryColor[q.category] || categoryColor.technical
                  }`}
                >
                  {q.category}
                </span>
              </div>

              {q.score !== undefined && q.score !== null ? (
                <div className="mt-3 rounded-xl border border-ink-600 bg-ink-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-scan" />
                    <span className="font-mono text-sm text-scan">{q.score}/10</span>
                  </div>
                  <p className="text-sm text-mist-300 mb-3">
                    <span className="text-mist-400">Your answer: </span>
                    {q.userAnswer}
                  </p>
                  <p className="text-sm text-mist-200">{q.feedback}</p>
                </div>
              ) : (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    value={answers[q._id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
                    placeholder="Type your answer here..."
                    className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60 resize-none"
                  />
                  <button
                    onClick={() => handleAnswerSubmit(q._id)}
                    disabled={submittingId === q._id}
                    className="mt-2 flex items-center gap-2 rounded-full border border-ink-600 px-5 py-2 text-xs font-mono uppercase tracking-widest text-mist-200 hover:border-signal/50 transition-colors disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submittingId === q._id ? "Scoring..." : "Submit answer"}
                  </button>
                </div>
              )}
            </SpotlightCard>
          ))}

          <button
            onClick={() => {
              setSession(null);
              setAnswers({});
            }}
            className="rounded-full border border-ink-600 px-6 py-2.5 text-sm text-mist-200 hover:border-signal/50 transition-colors"
          >
            Start a new interview
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
