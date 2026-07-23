import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Sparkles, Wand2 } from "lucide-react";
import api from "../services/api";
import Loader from "../components/Loader";
import ScoreGauge from "../components/ScoreGauge";
import SpotlightCard from "../components/SpotlightCard";

const importanceColor = {
  high: "text-rose-400 border-rose-400/40 bg-rose-400/10",
  medium: "text-scan border-scan/40 bg-scan/10",
  low: "text-signal-light border-signal/40 bg-signal/10",
};

const ResumeAnalyzer = () => {
  const [params] = useSearchParams();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(false);

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      setLoadingExisting(true);
      api
        .get(`/resumes/${id}`)
        .then((res) => setResult(res.data.data))
        .catch(() => toast.error("Could not load that analysis"))
        .finally(() => setLoadingExisting(false));
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose a PDF resume first");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    setLoading(true);
    try {
      const res = await api.post("/resumes/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  if (loadingExisting) return <Loader fullScreen />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-signal-light">Resume scan</span>
      <h1 className="mt-2 mb-8 font-display text-3xl font-bold text-mist-100">ATS Resume Analyzer</h1>

      {!result && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-dashed border-ink-600 bg-ink-800/40 p-10">
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center gap-3 cursor-pointer text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-signal/15 border border-signal/40">
              <UploadCloud className="h-6 w-6 text-signal-light" />
            </div>
            <p className="font-medium text-mist-100">
              {file ? file.name : "Click to upload your resume (PDF only)"}
            </p>
            <p className="text-xs text-mist-400">Max 5MB · Text-based PDF (not scanned image)</p>
            <input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <div className="mt-6 max-w-sm mx-auto">
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mist-400">
              Target role <span className="normal-case text-mist-400/60">(optional but recommended)</span>
            </label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-100 outline-none focus:border-signal/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 mx-auto flex items-center gap-2 rounded-full bg-signal px-7 py-3 text-sm font-medium text-white hover:bg-signal-dark transition-colors disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Analyzing with Gemini..." : "Run AI analysis"}
          </button>
        </form>
      )}

      {loading && <Loader label="Scanning resume" />}

      {result && (
        <div className="space-y-8">
          <SpotlightCard className="p-8 flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={result.atsScore} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-mist-400" />
                <span className="text-sm text-mist-300">{result.fileName}</span>
              </div>
              <p className="text-mist-200 leading-relaxed">{result.summary}</p>
            </div>
          </SpotlightCard>

          <div className="grid md:grid-cols-2 gap-6">
            <SpotlightCard className="p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-mist-100 mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="text-sm text-mist-300 flex gap-2">
                    <span className="text-emerald-400">+</span> {s}
                  </li>
                ))}
              </ul>
            </SpotlightCard>

            <SpotlightCard className="p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-mist-100 mb-4">
                <AlertTriangle className="h-5 w-5 text-rose-400" /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {result.weaknesses?.map((s, i) => (
                  <li key={i} className="text-sm text-mist-300 flex gap-2">
                    <span className="text-rose-400">–</span> {s}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>

          <SpotlightCard className="p-7">
            <h3 className="font-display text-lg font-semibold text-mist-100 mb-4">
              Missing keywords for this role
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords?.map((k, i) => (
                <span
                  key={i}
                  className="rounded-full border border-ink-600 bg-ink-700/50 px-3 py-1 text-xs font-mono text-mist-300"
                >
                  {k}
                </span>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-7">
            <h3 className="font-display text-lg font-semibold text-mist-100 mb-4">Skill gaps to close</h3>
            <div className="space-y-3">
              {result.skillGaps?.map((g, i) => (
                <div key={i} className="rounded-xl border border-ink-600 p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-mist-100">{g.skill}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase ${
                        importanceColor[g.importance] || importanceColor.medium
                      }`}
                    >
                      {g.importance}
                    </span>
                  </div>
                  <p className="text-sm text-mist-400">{g.suggestion}</p>
                </div>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-7">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-mist-100 mb-4">
              <Wand2 className="h-5 w-5 text-signal-light" /> Bullet point rewrites
            </h3>
            <div className="space-y-5">
              {result.improvedBulletPoints?.map((b, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-ink-600 bg-ink-900/60 p-4">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-mist-400">Original</p>
                    <p className="text-sm text-mist-400">{b.original}</p>
                  </div>
                  <div className="rounded-xl border border-signal/40 bg-signal/5 p-4">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-signal-light">Improved</p>
                    <p className="text-sm text-mist-100">{b.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>

          <button
            onClick={() => {
              setResult(null);
              setFile(null);
              setTargetRole("");
            }}
            className="rounded-full border border-ink-600 px-6 py-2.5 text-sm text-mist-200 hover:border-signal/50 transition-colors"
          >
            Scan another resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
