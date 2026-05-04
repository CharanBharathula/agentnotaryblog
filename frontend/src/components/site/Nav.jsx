import { useEffect, useState } from "react";
import { Github } from "lucide-react";

const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#features", label: "Features" },
  { href: "#commands", label: "Commands" },
  { href: "#walkthrough", label: "Walkthrough" },
  { href: "#compare", label: "Compare" },
  { href: "#blog", label: "Blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/60 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-emerald-400 transition-[width] duration-75 ease-linear pointer-events-none"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group" data-testid="nav-logo">
          <div className="relative h-7 w-7 rounded-md border border-white/15 bg-white/5 flex items-center justify-center">
            <div className="h-2 w-2 rounded-sm bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </div>
          <span className="font-semibold tracking-tight text-white">
            AgentNotary
          </span>
          <span className="font-mono text-[10px] text-white/40 border border-white/10 rounded px-1.5 py-0.5 ml-1">
            v0.3.0
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm text-white/60">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-white transition-colors"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="https://github.com/CharanBharathula/agentnotary"
          target="_blank"
          rel="noreferrer"
          data-testid="nav-github-button"
          className="inline-flex items-center gap-2 text-sm text-white border border-white/15 hover:border-white/30 hover:bg-white/5 px-3.5 py-1.5 rounded-md transition-colors"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">GitHub</span>
          <span className="font-mono text-[11px] text-white/50 border-l border-white/10 pl-2">
            ★ 1
          </span>
        </a>
      </div>
    </header>
  );
}
