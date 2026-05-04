import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Github } from "lucide-react";
import { useState } from "react";
import { mediaUrl } from "@/lib/mediaUrl";

export default function ArticleHeader() {
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
    <section id="top" className="relative pt-24 pb-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 radial-fade pointer-events-none" />
      <div className="ambient-beam" />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-testid="hero-eyebrow"
          className="flex flex-wrap items-center gap-2 mb-5"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/90 border border-emerald-400/20 bg-emerald-400/5 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            Open Source · Apache 2.0 · v0.3.0
          </span>
          <span className="font-mono text-[11px] text-white/35 border border-white/8 rounded px-2 py-0.5">
            12 min read
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          data-testid="hero-title"
          className="font-semibold tracking-tighter text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.03] text-white mb-5"
        >
          AgentNotary:
          <span className="block bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            The Trust Infrastructure
          </span>
          <span className="block text-white/65">for AI Agents.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          data-testid="hero-subtitle"
          className="text-base sm:text-lg text-white/55 leading-relaxed max-w-xl mb-6"
        >
          The notary stamp your agent needs before it ships. One CLI seals,
          tests, guards, and certifies — works with any framework, any model.
          Cryptographic{" "}
          <code className="font-mono text-emerald-300 bg-emerald-400/5 border border-emerald-400/15 rounded px-1 py-0.5 text-[0.92em]">
            agent.lock
          </code>
          , runtime cost caps, EU&nbsp;AI&nbsp;Act scaffolds, and adversarial
          fuzzing — open source, Apache&nbsp;2.0.
        </motion.p>

        {/* Author meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-wrap items-center gap-3 text-[13px] text-white/45 font-mono mb-8"
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[11px] text-white/65">
              CB
            </div>
            <span className="text-white/65">CharanBharathula</span>
          </div>
          <span>·</span>
          <span>May 4, 2026</span>
          <span>·</span>
          <span className="text-emerald-400/70">v0.3.0 release notes</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="flex flex-wrap items-center gap-3 mb-5"
        >
          <a
            href="https://github.com/CharanBharathula/agentnotary"
            target="_blank"
            rel="noreferrer"
            data-testid="hero-github-star-button"
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 rounded-md px-5 py-2.5 text-sm font-medium tracking-tight transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.08)]"
          >
            <Github className="h-4 w-4" />
            Star on GitHub
            <span className="font-mono text-[11px] opacity-55 border-l border-black/20 pl-2 ml-1">
              ★ 1
            </span>
          </a>
          <a
            href="#walkthrough"
            data-testid="hero-watch-demo-button"
            className="inline-flex items-center gap-2 bg-transparent border border-white/15 text-white hover:bg-white/5 hover:border-white/30 rounded-md px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Watch demo
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={copy}
            data-testid="hero-copy-pip-install"
            className="group inline-flex items-center gap-3 font-mono text-sm text-white/65 hover:text-white border border-white/10 bg-[#0A0A0A] hover:border-white/20 rounded-md px-4 py-2.5 transition-all"
          >
            <span className="text-emerald-400/80">$</span>
            <span className="select-all">pip install agentnotary</span>
            <span className="text-white/35 border-l border-white/10 pl-3 inline-flex items-center gap-1.5">
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
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-5 font-mono text-xs"
        >
          {[
            ["$47K", "burned in 11 days by one looping agent"],
            ["82%", "of teams can't track which agents they're running"],
            ["Aug 2, 2026", "EU AI Act enforcement begins"],
            ["169 tests · Ruff clean · CI green", "CI status"],
          ].map(([stat, label]) => (
            <div key={label} data-testid={`hero-stat-${stat}`}>
              <div className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-0.5">
                {stat}
              </div>
              <div className="text-white/38 text-[11px] leading-snug">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Cover image — bleeds to full width below the prose column */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.28 }}
        className="relative mx-auto max-w-5xl px-6 mt-12"
      >
        <div className="rounded-t-2xl overflow-hidden border border-b-0 border-white/10 bg-[#0A0A0A] shadow-[0_40px_100px_-20px_rgba(16,185,129,0.12)]">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-[#070707]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-auto font-mono text-[10px] text-white/30 tracking-widest uppercase">
              agentnotary · trust infrastructure
            </span>
          </div>
          <img
            src={mediaUrl("hero.png")}
            alt="AgentNotary Trust Infrastructure Illustration"
            data-testid="hero-image"
            className="w-full aspect-[16/7] object-cover object-center"
          />
        </div>
      </motion.div>
    </section>
  );
}
