import { Radar } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-ink-700/60 py-10 mt-24">
    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Radar className="h-4 w-4 text-signal-light" />
        <span className="font-display text-sm text-mist-200">NextHire</span>
      </div>
      <p className="font-mono text-xs text-mist-400 text-center">
        Built with React, Node.js, Express, MongoDB &amp; Gemini AI.
      </p>
      <p className="font-mono text-xs text-mist-400">© {new Date().getFullYear()} NextHire</p>
    </div>
  </footer>
);

export default Footer;
