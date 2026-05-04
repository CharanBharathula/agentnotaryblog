import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Github } from "lucide-react";
import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = "pip install agentnotary";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("clipboard unavailable");
      }
    } catch {
      // Fallback for restricted contexts
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* swallow */
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="top" className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute inset-0 radial-fade pointer-events-none" />
      <div className="ambient-beam" />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/90 border border-emerald-400/20 bg-emerald-400/5 rounded-full px-3 py-1"
            data-testid="hero-eyebrow"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            Open Source · Apache 2.0 · v0.3.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            data-testid="hero-title"
            className="mt-6 font-semibold tracking-tighter text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.02] text-white"
          >
            AgentNotary:
            <span className="block bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent">
              The Trust Infrastructure
            </span>
            <span className="block text-white/70">for AI Agents.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed"
            data-testid="hero-subtitle"
          >
            Notarize, govern, and audit autonomous agents. Cryptographic seals,
            runtime guardrails, EU&nbsp;AI&nbsp;Act documentation, and adversarial
            fuzzing — all in a single open-source CLI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="https://github.com/CharanBharathula/agentnotary"
              target="_blank"
              rel="noreferrer"
              data-testid="hero-github-star-button"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 rounded-md px-5 py-3 font-medium tracking-tight transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.08)]"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
              <span className="font-mono text-[11px] opacity-60 border-l border-black/20 pl-2 ml-1">
                ★ 1
              </span>
            </a>

            <a
              href="#walkthrough"
              data-testid="hero-watch-demo-button"
              className="inline-flex items-center gap-2 bg-transparent border border-white/15 text-white hover:bg-white/5 hover:border-white/30 rounded-md px-5 py-3 font-medium transition-colors"
            >
              Watch 60-second demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={copy}
            data-testid="hero-copy-pip-install"
            className="mt-6 group flex items-center gap-3 font-mono text-sm text-white/70 hover:text-white border border-white/10 bg-[#0A0A0A] hover:border-white/20 rounded-md px-4 py-2.5 transition-all"
          >
            <span className="text-emerald-400/80">$</span>
            <span className="select-all">pip install agentnotary</span>
            <span className="ml-2 text-white/40 border-l border-white/10 pl-3 inline-flex items-center gap-1.5">
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  copy
                </>
              )}
            </span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-square max-w-[520px] mx-auto">
            <div className="absolute -inset-8 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-3">
              <img
                src={`${BACKEND_URL}/api/media/hero.png`}
                alt="AgentNotary Trust Infrastructure Illustration"
                data-testid="hero-image"
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute top-5 left-5 font-mono text-[10px] text-white/40 tracking-widest uppercase">
                /agent.lock
              </div>
              <div className="absolute bottom-5 right-5 font-mono text-[10px] text-emerald-400/80 tracking-widest uppercase flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SEALED
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* stats strip */}
      <div className="relative mx-auto max-w-7xl px-6 mt-20 pt-10 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          {[
            ["97%", "of companies have deployed AI agents"],
            ["82%", "can't track which agents they're running"],
            ["Aug 2, 2026", "EU AI Act enforcement begins"],
            ["169", "tests · Ruff clean · CI green"],
          ].map(([stat, label]) => (
            <div key={label} data-testid={`hero-stat-${stat}`}>
              <div className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-1">
                {stat}
              </div>
              <div className="text-white/40 leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
