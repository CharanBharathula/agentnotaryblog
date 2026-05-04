import { Check, Minus } from "lucide-react";

const ROWS = [
  ["Tracing & evals",            "basic",  "deep",   "deep",   "basic", "deep"],
  ["Cost tracking",              "yes",    "yes",    "yes",    "yes",   "yes"],
  ["Active enforcement",         "yes",    "no",     "no",     "no",    "no"],
  ["Cryptographic seal",         "yes",    "no",     "no",     "no",    "no"],
  ["Provider-drift probe",       "yes",    "no",     "no",     "no",    "no"],
  ["EU AI Act docs",             "yes",    "no",     "no",     "no",    "no"],
  ["AI-BOM (CycloneDX/SPDX)",    "yes",    "no",     "no",     "no",    "no"],
  ["Adversarial fuzzer",         "yes",    "no",     "no",     "no",    "no"],
  ["Time-travel replay",         "yes",    "no",     "partial","no",    "partial"],
  ["Cross-model bench",          "yes",    "no",     "no",     "no",    "no"],
  ["Open source",                "Apache", "no",     "yes",    "part",  "part"],
  ["Framework lock-in",          "none",   "langchain","none", "none",  "none"],
];

const COLS = ["AgentNotary", "LangSmith", "Langfuse", "Helicone", "AgentOps"];

function Cell({ v }) {
  if (v === "yes")
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-400">
        <Check className="h-3.5 w-3.5" />
        <span className="font-mono text-xs">yes</span>
      </span>
    );
  if (v === "no")
    return (
      <span className="inline-flex items-center gap-1.5 text-white/25">
        <Minus className="h-3.5 w-3.5" />
        <span className="font-mono text-xs">—</span>
      </span>
    );
  return <span className="font-mono text-xs text-white/70">{v}</span>;
}

export default function Comparison() {
  return (
    <section id="compare" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 border border-white/10 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            The Position
          </div>
          <h2
            data-testid="comparison-heading"
            className="mt-5 font-semibold tracking-tighter text-white text-3xl sm:text-5xl leading-[1.05]"
          >
            They watch agents.
            <span className="block text-white/50">We certify them.</span>
          </h2>
          <p className="mt-5 text-white/60 max-w-2xl leading-relaxed">
            AgentNotary sits <em className="text-white not-italic">alongside</em>{" "}
            your observability stack, not against it. Keep LangSmith for traces;
            add AgentNotary for proof.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0A]">
          <table className="w-full border-collapse" data-testid="comparison-table">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left font-mono text-[10px] tracking-widest uppercase text-white/40">
                  Capability
                </th>
                {COLS.map((c, i) => (
                  <th
                    key={c}
                    className={`p-4 text-left font-mono text-[10px] tracking-widest uppercase ${
                      i === 0 ? "text-emerald-400 bg-white/[0.03]" : "text-white/40"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, r) => (
                <tr key={r} className="border-b border-white/[0.04] last:border-0">
                  <td className="p-4 text-white/80 text-sm">{row[0]}</td>
                  {row.slice(1).map((v, c) => (
                    <td
                      key={c}
                      className={`p-4 text-sm ${c === 0 ? "bg-white/[0.03]" : ""}`}
                    >
                      <Cell v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
