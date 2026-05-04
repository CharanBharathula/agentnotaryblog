import { useState } from "react";
import { Copy, Check } from "lucide-react";

const COMMANDS = [
  {
    id: "init",
    name: "init",
    desc: "Scaffold a new governance manifest.",
    lines: [
      { p: "$", t: "agentnotary init refund-bot", c: "cmd" },
      { p: "",  t: "✓ created  agentnotary.yaml", c: "ok" },
      { p: "",  t: "✓ created  prompts/system.md", c: "ok" },
      { p: "",  t: "✓ created  .agentnotary/", c: "ok" },
      { p: "→", t: "next: edit manifest, then `agentnotary seal`", c: "hint" },
    ],
  },
  {
    id: "seal",
    name: "seal",
    desc: "Cargo.lock for AI agents.",
    lines: [
      { p: "$", t: "agentnotary seal --probe", c: "cmd" },
      { p: "",  t: "hashing   manifest          sha256:8af3…a01c", c: "out" },
      { p: "",  t: "hashing   prompts/system.md sha256:19c9…7d2f", c: "out" },
      { p: "",  t: "hashing   tools (3)         sha256:b410…ffe1", c: "out" },
      { p: "",  t: "probing   claude-sonnet-4-5-20251022 sha256:2d8e…11a0", c: "out" },
      { p: "",  t: "✓ agent.lock sealed · 0 drift detected", c: "ok" },
    ],
  },
  {
    id: "guard",
    name: "guard run",
    desc: "Block runaway loops at the API boundary.",
    lines: [
      { p: "$", t: "agentnotary guard run -- python refund_bot.py", c: "cmd" },
      { p: "",  t: "proxy listening  127.0.0.1:8787", c: "out" },
      { p: "",  t: "cap      $0.50/session · 25 llm calls · 60 rpm", c: "out" },
      { p: "",  t: "allow    [lookup_order, process_refund]", c: "out" },
      { p: "",  t: "BLOCK    cost exceeded @ call 14  →  403 billing_hard_limit_reached", c: "err" },
      { p: "",  t: "session total: $0.50 · 14 llm calls · exited", c: "out" },
    ],
  },
  {
    id: "attack",
    name: "attack",
    desc: "OWASP LLM Top 10 adversarial fuzzer.",
    lines: [
      { p: "$", t: "agentnotary attack --suite owasp-llm-top10 --live", c: "cmd" },
      { p: "",  t: "LLM01 prompt-injection        42/50 blocked  (84%)", c: "out" },
      { p: "",  t: "LLM02 insecure-output          48/50 blocked  (96%)", c: "out" },
      { p: "",  t: "LLM06 sensitive-info           49/50 blocked  (98%)", c: "out" },
      { p: "",  t: "LLM08 excessive-agency         40/50 blocked  (80%)", c: "out" },
      { p: "",  t: "vuln rate 8.5% · report → attack_report.json", c: "ok" },
    ],
  },
  {
    id: "compliance",
    name: "compliance",
    desc: "EU AI Act Annex IV scaffold.",
    lines: [
      { p: "$", t: "agentnotary compliance --standard eu-ai-act", c: "cmd" },
      { p: "",  t: "classify  risk = limited   (rule: EU-AI-ACT-ANNEX-III-payment)", c: "out" },
      { p: "",  t: "generate  docs/eu-ai-act/annex-iv.md    (28 sections)", c: "out" },
      { p: "",  t: "generate  docs/eu-ai-act/annex-iv.json  (GRC-ready)", c: "out" },
      { p: "",  t: "⚠ legal disclaimer: scaffold only — counsel review required", c: "warn" },
      { p: "",  t: "✓ compliance pack ready", c: "ok" },
    ],
  },
  {
    id: "bom",
    name: "bom",
    desc: "AI-BOM · CycloneDX + SPDX.",
    lines: [
      { p: "$", t: "agentnotary bom --format cyclonedx", c: "cmd" },
      { p: "",  t: "enumerate  models (1) prompts (4) tools (3) deps (47)", c: "out" },
      { p: "",  t: "write      agent.sbom.cdx.json  (CycloneDX 1.6)", c: "out" },
      { p: "",  t: "✓ SBOM ready for procurement", c: "ok" },
    ],
  },
  {
    id: "bench",
    name: "bench",
    desc: "Cross-model Pareto (cost vs accuracy).",
    lines: [
      { p: "$", t: "agentnotary bench --models claude-sonnet-4-5-20251022,gpt-4o,gemini-2.5-flash", c: "cmd" },
      { p: "",  t: "  acc%", c: "out" },
      { p: "",  t: "100 ┤         ◆ claude-sonnet-4-5-20251022", c: "out" },
      { p: "",  t: " 90 ┤    ◆ gpt-4o", c: "out" },
      { p: "",  t: " 80 ┤ ◆ gemini-2.5-flash", c: "out" },
      { p: "",  t: "    └──────────────────── $/1K", c: "out" },
      { p: "",  t: "recommended: gpt-4o  (Pareto-optimal)", c: "ok" },
    ],
  },
  {
    id: "replay",
    name: "replay",
    desc: "Time-travel debugger.",
    lines: [
      { p: "$", t: "agentnotary replay abc123 --rewind --step 7 --edit 'skip refund check'", c: "cmd" },
      { p: "",  t: "fork   session abc123 @ step 7", c: "out" },
      { p: "",  t: "replay steps 1..6 (deterministic)", c: "out" },
      { p: "",  t: "diverge step 7 → live call claude-sonnet-4-5-20251022", c: "out" },
      { p: "",  t: "trace  saved → sessions/abc123-fork.json", c: "ok" },
    ],
  },
];

const TONE = {
  cmd: "text-white",
  ok: "text-emerald-400",
  err: "text-rose-400",
  warn: "text-amber-400",
  hint: "text-white/50 italic",
  out: "text-white/65",
};

export default function Commands() {
  const [active, setActive] = useState(COMMANDS[0].id);
  const [copied, setCopied] = useState(false);
  const cmd = COMMANDS.find((c) => c.id === active);
  const mainCmd = cmd.lines.find((l) => l.c === "cmd")?.t ?? "";

  const copyCmd = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(mainCmd);
      } else {
        throw new Error("clipboard unavailable");
      }
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = mainCmd;
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
    <section id="commands" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 border border-white/10 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              The Eight Commands
            </div>
            <h2
              data-testid="commands-heading"
              className="mt-5 font-semibold tracking-tighter text-white text-3xl sm:text-5xl leading-[1.05]"
            >
              Every step of the governance loop.
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-sm font-mono">
            Framework-agnostic. LangChain, CrewAI, Anthropic SDK, raw OpenAI — if
            it speaks HTTP, <span className="text-white">guard</span> proxies it.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* Tabs */}
          <div className="lg:col-span-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {COMMANDS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                data-testid={`command-tab-${c.id}`}
                className={`text-left px-4 py-3 rounded-md border transition-all whitespace-nowrap ${
                  active === c.id
                    ? "border-white/15 bg-white/[0.04] text-white"
                    : "border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div className="font-mono text-sm">
                  <span className="text-emerald-400/80">▸</span> {c.name}
                </div>
                <div className="text-[11px] text-white/40 mt-0.5 hidden lg:block">
                  {c.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Terminal */}
          <div className="lg:col-span-9">
            <div className="rounded-xl border border-white/10 bg-[#040404] overflow-hidden shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0A0A0A]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="font-mono text-[11px] text-white/40 tracking-widest uppercase">
                  ~/refund-bot — agentnotary {cmd.name}
                </div>
                <button
                  onClick={copyCmd}
                  data-testid={`command-copy-${cmd.id}`}
                  className="font-mono text-[11px] text-white/50 hover:text-white inline-flex items-center gap-1.5"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? "copied" : "copy"}
                </button>
              </div>
              <div className="p-6 font-mono text-[13px] leading-[1.7] text-white/75">
                {cmd.lines.map((l, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-4 shrink-0 text-emerald-400/70 select-none">
                      {l.p}
                    </span>
                    <span className={TONE[l.c] ?? "text-white/75"}>{l.t}</span>
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <span className="w-4 text-emerald-400/70">$</span>
                  <span className="cursor-blink text-white"> </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
