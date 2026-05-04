import { motion } from "framer-motion";
import { AlertTriangle, Eye, DollarSign, ShieldAlert } from "lucide-react";

const PROBLEMS = [
  {
    icon: Eye,
    tag: "OBSERVABILITY ≠ TRUST",
    title: "Every tool watches. None of them certify.",
    body:
      "LangSmith, Langfuse, Helicone, AgentOps — they log what happened. None cryptographically prove your agent didn't drift between Monday and Friday.",
  },
  {
    icon: DollarSign,
    tag: "COST RUNAWAY",
    title: "A $4,000 overnight loop is a deploy away.",
    body:
      "Without active enforcement at the API boundary, a single bad prompt can burn your quota before an on-call engineer finishes their coffee.",
  },
  {
    icon: ShieldAlert,
    tag: "OWASP LLM TOP 10",
    title: "Prompt injection is a production reality.",
    body:
      "Credential extraction, system-prompt leakage, excessive agency — adversarial surfaces no SAST tool can reason about.",
  },
  {
    icon: AlertTriangle,
    tag: "EU AI ACT · AUG 2, 2026",
    title: "Annex IV docs aren't optional anymore.",
    body:
      "Regulators want deterministic, auditable documentation of intended purpose, risk class, and data handling — not a LangSmith trace.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg-dense opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div
            data-testid="problem-eyebrow"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400/80 border border-amber-400/20 bg-amber-400/5 rounded-full px-3 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            The Wild West of Autonomous Agents
          </div>
          <h2
            data-testid="problem-heading"
            className="mt-5 font-semibold tracking-tighter text-white text-3xl sm:text-5xl leading-[1.05]"
          >
            Agents ship fast.
            <br />
            <span className="text-white/50">
              Accountability ships never.
            </span>
          </h2>
          <p className="mt-6 text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl">
            97% of companies deploy AI agents. 82% can't name which agents they
            run. The governance primitives we expect from{" "}
            <span className="text-white font-mono text-[0.95em]">cargo</span>,{" "}
            <span className="text-white font-mono text-[0.95em]">npm audit</span>,
            and SBOMs simply don't exist for agents — yet.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
          {PROBLEMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.tag}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                data-testid={`problem-card-${i}`}
                className="bg-[#0A0A0A] p-8 sm:p-10 hover:bg-[#0D0D0D] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center">
                    <Icon className="h-4 w-4 text-amber-400/80" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                      {p.tag}
                    </div>
                    <h3 className="text-white text-lg sm:text-xl font-medium tracking-tight leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-white/55 text-sm sm:text-base leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
