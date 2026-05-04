import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-14 mt-10 overflow-hidden" data-testid="site-footer">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-lg">
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-md border border-white/15 bg-white/5 flex items-center justify-center">
                <div className="h-2 w-2 rounded-sm bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              </div>
              <span className="font-semibold tracking-tight text-white text-lg">
                AgentNotary
              </span>
            </div>
            <p className="mt-4 text-white/50 text-sm leading-relaxed">
              Notarize, govern, and audit AI agents. Open source under Apache 2.0.
              The <span className="font-mono text-white/80">agent.lock</span> format
              is a public spec — built to live on every agent in production.
            </p>
            <a
              href="https://github.com/CharanBharathula/agentnotary"
              target="_blank"
              rel="noreferrer"
              data-testid="footer-github-button"
              className="mt-6 inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 rounded-md px-4 py-2 text-sm font-medium transition-colors active:scale-[0.98]"
            >
              <Github className="h-3.5 w-3.5" />
              github.com/CharanBharathula/agentnotary
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">
                Project
              </div>
              <ul className="space-y-2 text-white/60">
                <li><a href="#problem" className="hover:text-white">Problem</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#commands" className="hover:text-white">Commands</a></li>
                <li><a href="#walkthrough" className="hover:text-white">Walkthrough</a></li>
                <li><a href="#compare" className="hover:text-white">Compare</a></li>
                <li><a href="#blog" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">
                Resources
              </div>
              <ul className="space-y-2 text-white/60">
                <li><a href="https://github.com/CharanBharathula/agentnotary" target="_blank" rel="noreferrer" className="hover:text-white">Repository</a></li>
                <li><a href="https://github.com/CharanBharathula/agentnotary/releases/tag/v0.3.0" target="_blank" rel="noreferrer" className="hover:text-white">v0.3.0 notes</a></li>
                <li><a href="https://github.com/CharanBharathula/agentnotary/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-white">Apache 2.0</a></li>
                <li><a href="https://github.com/CharanBharathula/agentnotary/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="hover:text-white">Contribute</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-white/35">
          <div>© 2026 AgentNotary · built by @CharanBharathula</div>
          <div className="flex items-center gap-5">
            <span>v0.3.0 · 169 tests · Ruff clean</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              notarized
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
