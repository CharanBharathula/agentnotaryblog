import { motion } from "framer-motion";
import { Lock, FileCheck2, Swords, ShieldCheck, GitBranch, ListTree } from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    tag: "agentnotary seal",
    title: "Cryptographic Notarization",
    body:
      "Cargo.lock for AI agents. Hash manifest, prompts, tool source, MCP package versions, deps. Optional probe-response hash catches silent provider weight updates.",
    tall: true,
    code: "agentnotary seal --verify",
    accent: "emerald",
  },
  {
    icon: FileCheck2,
    tag: "agentnotary compliance",
    title: "EU AI Act Compliance",
    body:
      "Annex IV technical documentation generated deterministically from manifest + seal + sessions. Markdown for engineers, JSON for GRC.",
    code: "--standard eu-ai-act",
    accent: "emerald",
  },
  {
    icon: Swords,
    tag: "agentnotary attack",
    title: "Adversarial Fuzzing",
    body:
      "Bundled OWASP LLM Top 10 corpus. Probes prompt injection, credential extraction, system-prompt leakage, excessive agency.",
    code: "--suite owasp-llm-top10",
    accent: "amber",
  },
  {
    icon: ShieldCheck,
    tag: "agentnotary guard run",
    title: "Runtime Guardrails",
    body:
      "Local HTTP reverse proxy. Framework-agnostic. Blocks cost runaway, infinite loops, PII exfiltration, disallowed tools — with provider-shaped 403s.",
    tall: true,
    code: "-- python agent.py",
    accent: "emerald",
  },
  {
    icon: ListTree,
    tag: "agentnotary bom",
    title: "AI Bill of Materials",
    body:
      "CycloneDX 1.6 + SPDX 2.3 compliant SBOMs. Models, prompts, tools, MCP servers, deps — each cryptographically hashed.",
    code: "--format cyclonedx",
    accent: "sky",
  },
  {
    icon: GitBranch,
    tag: "agentnotary replay",
    title: "Time-Travel Debugger",
    body:
      "Fork any recorded session at any step, edit the prompt, simulate forward. Finally answer: 'why did the agent take that path?'",
    code: "--rewind --step 7",
    accent: "sky",
  },
];

const ACCENT = {
  emerald: { dot: "bg-emerald-400", text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(16,185,129,0.6)]" },
  amber: { dot: "bg-amber-400", text: "text-amber-400", glow: "shadow-[0_0_12px_rgba(245,166,35,0.6)]" },
  sky: { dot: "bg-sky-400", text: "text-sky-400", glow: "shadow-[0_0_12px_rgba(56,189,248,0.6)]" },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div
              data-testid="features-eyebrow"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 border border-white/10 rounded-full px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              The Governance Loop
            </div>
            <h2
              data-testid="features-heading"
              className="mt-5 font-semibold tracking-tighter text-white text-3xl sm:text-5xl leading-[1.05]"
            >
              Declare → Seal → Enforce → Certify.
            </h2>
            <p className="mt-5 text-white/60 max-w-xl leading-relaxed">
              Eight composable CLI commands. Drop them into CI. Run them alongside
              LangSmith. They don't compete — they certify.
            </p>
          </div>
          <a
            href="#commands"
            data-testid="features-browse-commands"
            className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white border-b border-white/10 hover:border-white/40 pb-1 transition-colors self-start"
          >
            Browse all 8 commands →
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const a = ACCENT[f.accent];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                data-testid={`feature-card-${i}`}
                className={`trace-card group relative bg-[#0A0A0A] border border-white/10 rounded-xl p-7 hover:border-white/20 transition-all ${
                  f.tall ? "lg:row-span-1" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <Icon className="h-4 w-4 text-white/90" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-white/40">
                    <span className={`h-1.5 w-1.5 rounded-full ${a.dot} ${a.glow}`} />
                    0{i + 1}
                  </div>
                </div>
                <div className="font-mono text-[11px] tracking-wider text-white/40 mb-2">
                  {f.tag}
                </div>
                <h3 className="text-white text-lg font-medium tracking-tight mb-3">
                  {f.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.body}</p>
                <div className="mt-6 pt-5 border-t border-white/5 font-mono text-[12px] text-white/60 flex items-center gap-2">
                  <span className={a.text}>▸</span>
                  <span className="truncate">{f.code}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
