const lines = [
  { w: "70%" },
  { w: "45%" },
  { w: "88%" },
  { w: "60%" },
  { w: "92%" },
  { w: "50%" },
  { w: "78%" },
  { w: "35%" },
];

/**
 * Signature element for the hero: a mock resume being scanned by an
 * ATS beam, corner-bracket viewfinder, and live HUD readouts.
 */
const ResumeScannerMockup = () => (
  <div className="relative mx-auto w-full max-w-md">
    {/* corner brackets */}
    <div className="absolute -top-3 -left-3 h-8 w-8 border-t-2 border-l-2 border-signal-light/70 rounded-tl-lg" />
    <div className="absolute -top-3 -right-3 h-8 w-8 border-t-2 border-r-2 border-signal-light/70 rounded-tr-lg" />
    <div className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-signal-light/70 rounded-bl-lg" />
    <div className="absolute -bottom-3 -right-3 h-8 w-8 border-b-2 border-r-2 border-signal-light/70 rounded-br-lg" />

    <div className="relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/80 p-6 card-glow">
      {/* scanning beam */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scanline bg-gradient-to-b from-transparent via-signal-light/20 to-transparent" />

      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-mist-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-scan animate-pulse" /> Scanning resume.pdf
        </span>
        <span className="text-signal-light">ATS_MATCH 87%</span>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-1/2 rounded bg-mist-100/20" />
        {lines.map((l, i) => (
          <div
            key={i}
            className="h-2 rounded bg-ink-600"
            style={{ width: l.w, opacity: 1 - i * 0.06 }}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {["React", "Node.js", "MongoDB", "+ 3 gaps"].map((tag, i) => (
          <span
            key={tag}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] border ${
              tag.includes("gaps")
                ? "border-scan/50 text-scan bg-scan/10"
                : "border-signal/40 text-signal-light bg-signal/10"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default ResumeScannerMockup;
