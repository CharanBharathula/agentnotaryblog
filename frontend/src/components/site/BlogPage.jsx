import { motion } from "framer-motion";
import {
  Github,
  ArrowUpRight,
  AlertTriangle,
  Eye,
  DollarSign,
  ShieldAlert,
  Lock,
  FileCheck2,
  Swords,
  ShieldCheck,
  GitBranch,
  ListTree,
} from "lucide-react";
import Commands from "./Commands";
import Walkthrough from "./Walkthrough";
import Comparison from "./Comparison";
import { mediaUrl } from "@/lib/mediaUrl";

// ── Article typography helpers ─────────────────────────────────────────

function Lead({ children }) {
  return (
    <p className="text-lg sm:text-xl text-white/80 leading-[1.75] mb-10 border-l-2 border-emerald-400/60 pl-6">
      {children}
    </p>
  );
}

function H3({ id, children }) {
  return (
    <h3
      id={id}
      className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mt-14 mb-5 leading-snug scroll-mt-20"
    >
      {children}
    </h3>
  );
}

function H4({ children }) {
  return (
    <h4 className="text-white text-lg font-semibold tracking-tight mt-10 mb-3">
      {children}
    </h4>
  );
}

function P({ children }) {
  return (
    <p className="text-white/70 text-base sm:text-[17px] leading-[1.82] mb-5">
      {children}
    </p>
  );
}

function Mono({ children }) {
  return (
    <code className="font-mono text-[0.92em] text-emerald-300 bg-emerald-400/5 border border-emerald-400/15 rounded px-1.5 py-0.5">
      {children}
    </code>
  );
}

function Pull({ children }) {
  return (
    <blockquote className="my-10 border-l-2 border-white/20 pl-6 py-2 text-white/85 text-xl sm:text-2xl tracking-tight italic leading-snug">
      {children}
    </blockquote>
  );
}

function Note({ children }) {
  return (
    <div className="my-6 flex gap-3 bg-amber-400/5 border border-amber-400/20 rounded-lg p-4">
      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-amber-200/80 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

const TONE_MAP = {
  cmd: "text-white",
  ok: "text-emerald-400",
  err: "text-rose-400",
  warn: "text-amber-400",
  out: "text-white/65",
};

function TerminalBlock({ caption, lines }) {
  return (
    <figure className="my-10">
      <div className="rounded-xl border border-white/10 bg-[#040404] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0A0A0A]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
          </div>
          <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
            agentnotary
          </div>
          <div className="w-10" />
        </div>
        <div className="p-5 font-mono text-[12.5px] leading-[1.75]">
          {lines.map((l, i) => (
            <div key={i} className="flex gap-3">
              <span className="w-3 shrink-0 text-emerald-400/70 select-none">
                {l.p}
              </span>
              <span className={TONE_MAP[l.tone] ?? "text-white/75"}>{l.t}</span>
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs font-mono text-white/40 tracking-wider uppercase">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function YamlBlock({ caption, code }) {
  return (
    <figure className="my-10">
      <div className="rounded-xl border border-white/10 bg-[#040404] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0A0A0A]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
          </div>
          <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
            {caption}
          </div>
          <div className="w-10" />
        </div>
        <pre className="p-5 font-mono text-[12.5px] leading-[1.75] text-white/75 overflow-x-auto whitespace-pre">
          {code}
        </pre>
      </div>
    </figure>
  );
}

// ── Problem cards data ─────────────────────────────────────────────────

const PROBLEMS = [
  {
    icon: Eye,
    tag: "OBSERVABILITY ≠ TRUST",
    title: "Every tool watches. None of them certify.",
    body: "LangSmith, Langfuse, Helicone, AgentOps — they log what happened. None cryptographically prove your agent didn't drift between Monday and Friday.",
  },
  {
    icon: DollarSign,
    tag: "COST RUNAWAY",
    title: "A runaway loop is a deploy away.",
    body: "Without active enforcement at the API boundary, a single bad prompt can burn your budget. Observability tools send alerts after the damage is done.",
  },
  {
    icon: ShieldAlert,
    tag: "OWASP LLM TOP 10",
    title: "Prompt injection is a production reality.",
    body: "Credential extraction, system-prompt leakage, excessive agency — adversarial surfaces no SAST tool can reason about.",
  },
  {
    icon: AlertTriangle,
    tag: "EU AI ACT · AUG 2, 2026",
    title: "Annex IV docs aren't optional anymore.",
    body: "Regulators want deterministic, auditable documentation of intended purpose, risk class, and data handling — not a LangSmith trace.",
  },
];

// ── Feature cards data ─────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Lock,
    tag: "agentnotary seal",
    title: "Cryptographic Notarization",
    body: "Hashes manifest, prompts, tool source, MCP package versions, and dependencies into agent.lock. Run --verify in CI to fail if anything drifted. --probe catches silent provider weight updates.",
    code: "agentnotary seal --verify",
    accent: "emerald",
  },
  {
    icon: FileCheck2,
    tag: "agentnotary compliance",
    title: "EU AI Act Compliance",
    body: "Generates Annex IV technical documentation from manifest + seal + sessions. Rule engine classifier — every decision cites the rule that fired. Output is a scaffold; counsel review required.",
    code: "--standard eu-ai-act",
    accent: "emerald",
  },
  {
    icon: Swords,
    tag: "agentnotary attack",
    title: "Adversarial Fuzzing",
    body: "Bundled OWASP LLM Top 10 corpus. Dry-run predicts blockability from manifest. Live mode sends real payloads. Reports vulnerability rate and per-attack evidence.",
    code: "--suite owasp-llm-top10 --live",
    accent: "amber",
  },
  {
    icon: ShieldCheck,
    tag: "agentnotary guard run",
    title: "Runtime Guardrails",
    body: "Local HTTP reverse proxy. Framework-agnostic. Blocks on cost, iteration count, tool allowlist/denylist, PII patterns, content length, and rate limits. Returns provider-shaped 403s.",
    code: "-- python my_agent.py",
    accent: "emerald",
  },
  {
    icon: ListTree,
    tag: "agentnotary bom",
    title: "AI Bill of Materials",
    body: "CycloneDX 1.6 (OWASP) and SPDX 2.3 (Linux Foundation) compliant SBOMs. Models, prompts, tools, MCP servers, deps — each cryptographically hashed.",
    code: "--format cyclonedx",
    accent: "sky",
  },
  {
    icon: GitBranch,
    tag: "agentnotary replay",
    title: "Time-Travel Debugger",
    body: "Replay any recorded session, fork at any step, edit the prompt, simulate forward. Without an API key: deterministic stand-in. With a key: real LLM call for the diverged step only.",
    code: "--rewind --step 7 --edit '...'",
    accent: "sky",
  },
];

const ACCENT = {
  emerald: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.6)]",
  },
  amber: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    glow: "shadow-[0_0_12px_rgba(245,166,35,0.6)]",
  },
  sky: {
    dot: "bg-sky-400",
    text: "text-sky-400",
    glow: "shadow-[0_0_12px_rgba(56,189,248,0.6)]",
  },
};

function ChapterDivider({ num, label }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="font-mono text-[10px] text-white/25 tracking-widest shrink-0">
        {String(num).padStart(2, "0")}
      </span>
      <div className="h-px flex-1 bg-white/5" />
      <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest shrink-0">
        {label}
      </span>
    </div>
  );
}

const QUICKSTART_YAML = `apiVersion: agentnotary/v0.2
agent:
  name: refund-bot
  version: 0.1.0
  framework: anthropic
  model:
    provider: anthropic
    name: claude-sonnet-4-5-20251022
    temperature: 0.2
    max_tokens: 2048

  system_prompt_file: ./prompts/system.md

  tools:
    - { name: lookup_order,   type: function, module: app.tools:lookup_order }
    - { name: process_refund, type: api,
        endpoint: https://api.acme.com/refunds, auth: ACME_KEY }

  guardrails:
    cost:       { max_usd_per_session: 0.50, max_usd_per_call: 0.10, action: block }
    iterations: { max_llm_calls: 25, action: block }
    tools:      { allowlist: [lookup_order, process_refund] }
    pii:        { patterns: [SSN, EMAIL, CREDIT_CARD], action: redact, direction: both }
    rate:       { max_calls_per_minute: 60 }

  compliance:
    risk_class: limited
    affected_users: external_consumers
    intended_purpose: |
      Resolves Tier-1 customer refund requests for orders under $50.
    out_of_scope: [chargebacks, subscriptions]
    data_handling:
      processes_pii: true
      pii_categories: [name, email, order_id]
      retention_days: 90`;

// ── Main component ─────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <div className="relative">
      {/* ━━━ BLOG HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="blog" className="relative pt-8 pb-14">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 border border-white/10 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Technical Overview · v0.3.0
            </div>

            <h2
              data-testid="blog-title"
              className="mt-6 font-semibold tracking-tighter text-white text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.03]"
            >
              AgentNotary: What it does, how to use it, and why it exists.
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50 font-mono">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[11px] text-white/70">
                  CB
                </div>
                <span className="text-white/70">CharanBharathula</span>
              </div>
              <span>·</span>
              <span>May 4, 2026</span>
              <span>·</span>
              <span>10 min read</span>
              <span>·</span>
              <span className="text-emerald-400/80">v0.3.0</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A]"
          >
            <img
              src={mediaUrl("repo.png")}
              alt="AgentNotary repository"
              data-testid="blog-hero-image"
              className="w-full aspect-[16/9] object-cover object-top"
            />
          </motion.div>

          <article>
            <Lead>
              AgentNotary is an open-source CLI tool (Apache 2.0, Python 3.9+)
              for notarizing, governing, and auditing AI agents. It gives you
              eight commands that cover the full agent lifecycle — from
              cryptographic sealing and runtime enforcement to EU AI Act
              documentation and adversarial fuzzing. This post covers what each
              command actually does, how to configure it, and where it fits
              alongside your existing stack.
            </Lead>
          </article>
        </div>
      </section>

      {/* ━━━ CH 1: THE PROBLEM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="problem" className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg-dense opacity-20 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="max-w-3xl mb-10">
            <div
              data-testid="problem-eyebrow"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400/80 border border-amber-400/20 bg-amber-400/5 rounded-full px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              The gap in the current stack
            </div>
            <h3
              data-testid="problem-heading"
              className="mt-5 font-semibold tracking-tighter text-white text-2xl sm:text-4xl leading-[1.05]"
            >
              Observability tools watch.
              <br />
              <span className="text-white/50">None of them enforce.</span>
            </h3>
            <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
              97% of companies have deployed AI agents. 82% can't track what
              agents they're running. The existing observability platforms —
              LangSmith, Langfuse, Helicone, AgentOps — are passive: they
              record what happened. AgentNotary is active: it intercepts,
              seals, blocks, and certifies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
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
                  className="bg-[#0A0A0A] p-7 sm:p-9 hover:bg-[#0D0D0D] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 shrink-0 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-amber-400/80" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                        {p.tag}
                      </div>
                      <h4 className="text-white text-base sm:text-lg font-medium tracking-tight leading-snug">
                        {p.title}
                      </h4>
                      <p className="mt-2.5 text-white/55 text-sm leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ━━━ Article: install + what it does ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <ChapterDivider num={1} label="Install & Configure" />
        </div>
        <article>
          <H3 id="install">Installation</H3>
          <P>
            AgentNotary is on PyPI. Python 3.9 or higher required. Install the
            base package or pull in extras depending on what you need:
          </P>
          <TerminalBlock
            caption="pip install"
            lines={[
              { p: "$", t: "pip install agentnotary", tone: "cmd" },
              { p: "$", t: 'pip install "agentnotary[anthropic]"   # live evals + attack runs', tone: "cmd" },
              { p: "$", t: 'pip install "agentnotary[openai]"', tone: "cmd" },
              { p: "$", t: 'pip install "agentnotary[pii]"          # Presidio NER for PII detection', tone: "cmd" },
              { p: "$", t: 'pip install "agentnotary[all]"', tone: "cmd" },
            ]}
          />

          <H3 id="config">The manifest: agentnotary.yaml</H3>
          <P>
            Everything AgentNotary does starts from a manifest file. Run{" "}
            <Mono>agentnotary init my-agent</Mono> to scaffold one, then edit
            it. The manifest declares your agent's identity, model, tools,
            guardrails, and compliance metadata. Here's a realistic example for
            a refund bot:
          </P>
          <YamlBlock caption="agentnotary.yaml" code={QUICKSTART_YAML} />
          <P>
            The <Mono>guardrails</Mono> block is what <Mono>guard run</Mono>{" "}
            enforces at runtime. The <Mono>compliance</Mono> block is what{" "}
            <Mono>compliance --standard eu-ai-act</Mono> uses to generate
            documentation. Both are optional — you can start with just{" "}
            <Mono>seal</Mono> and add the rest incrementally.
          </P>
        </article>
      </div>

      {/* ━━━ CH 2: WALKTHROUGH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Walkthrough />

      {/* ━━━ Article: the eight commands ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mx-auto max-w-3xl px-6 pb-4 pt-4">
        <div className="mb-8">
          <ChapterDivider num={2} label="The Eight Commands" />
        </div>
        <article>
          <H3 id="eight-commands">Eight commands, three layers.</H3>
          <P>
            The commands are organized into three groups. You don't have to use
            all of them — each one is independent and composable with your
            existing CI or LLM framework.
          </P>

          <div className="my-8 space-y-1 font-mono text-sm">
            {[
              ["Notarize & Govern", "seal · guard · compliance"],
              ["Audit & Test", "bom · bench · attack · replay"],
              ["Project lifecycle", "init · validate · test · tag · rollback · sessions · scan"],
            ].map(([layer, cmds]) => (
              <div key={layer} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5 border-b border-white/5">
                <span className="text-white/40 text-xs uppercase tracking-widest w-40 shrink-0">{layer}</span>
                <span className="text-emerald-300/80 text-xs">{cmds}</span>
              </div>
            ))}
          </div>

          <H4>seal — Cargo.lock for your agent</H4>
          <P>
            <Mono>agentnotary seal</Mono> hashes everything that defines your
            agent: the manifest, raw and normalized prompts, tool source code,
            MCP package versions, and dependencies. The result is{" "}
            <Mono>agent.lock</Mono>. Run <Mono>seal --verify</Mono> in CI and
            the pipeline fails the moment anything changes. The optional{" "}
            <Mono>--probe</Mono> flag sends a canonical prompt and hashes the
            response, catching silent provider weight updates behind the same
            model ID.
          </P>
          <TerminalBlock
            caption="seal — write, verify, probe"
            lines={[
              { p: "$", t: "agentnotary seal             # write agent.lock", tone: "cmd" },
              { p: "$", t: "agentnotary seal --verify    # fail CI if drift detected", tone: "cmd" },
              { p: "$", t: "agentnotary seal --probe     # also hash a probe response", tone: "cmd" },
              { p: "", t: "✓ agent.lock sealed · manifest · prompts · tools · deps", tone: "ok" },
            ]}
          />

          <H4>guard run — block at the API boundary</H4>
          <P>
            <Mono>agentnotary guard run -- &lt;your agent command&gt;</Mono>{" "}
            starts a local HTTP reverse proxy in front of your LLM provider.
            Framework-agnostic — anything that speaks HTTP is covered. Guardrails
            are declared in <Mono>agentnotary.yaml</Mono> under{" "}
            <Mono>guardrails:</Mono> and cover six dimensions: cost, iteration
            counts, tool allowlist/denylist/approval, PII patterns, content
            limits, and rate. When a policy fires, it returns a
            provider-shaped 403 so your SDK raises its native exception — your
            agent code doesn't change.
          </P>
          <TerminalBlock
            caption="guard run — enforce at runtime"
            lines={[
              { p: "$", t: "agentnotary guard run -- python -m refund_bot", tone: "cmd" },
              { p: "", t: "proxy listening  127.0.0.1:8787", tone: "out" },
              { p: "", t: "enforcing  cost=$0.50/session · 25 llm calls · 60 rpm", tone: "out" },
              { p: "", t: "enforcing  tools=[lookup_order, process_refund]", tone: "out" },
              { p: "", t: "enforcing  pii=redact [SSN EMAIL CREDIT_CARD] both directions", tone: "out" },
              { p: "", t: "BLOCK  cost guardrail hit → 403 billing_hard_limit_reached", tone: "err" },
            ]}
          />

          <H4>compliance — EU AI Act Annex IV scaffold</H4>
          <P>
            Generates Annex IV technical documentation deterministically from
            the manifest, seal, and recorded sessions. Output is Markdown for
            engineers and JSON for GRC tools. The risk classifier is a rule
            engine — not an LLM call — so every classification cites the exact
            rule that fired (e.g.{" "}
            <Mono>EU-AI-ACT-ANNEX-III-payment</Mono> triggered by keyword{" "}
            <Mono>payment</Mono> in <Mono>tools/description</Mono>).
          </P>
          <Note>
            Generated documentation is a scaffold only — not legal advice.
            Review by qualified counsel and a notified body is required before
            regulatory submission.
          </Note>

          <H4>attack — OWASP LLM Top 10 fuzzer</H4>
          <P>
            Ships a bundled attack corpus covering the OWASP LLM Top 10:
            prompt injection, insecure output handling, sensitive information
            disclosure, excessive agency, and more. Two modes:{" "}
            <Mono>--dry-run</Mono> (predicts blockability from the manifest
            without sending real prompts) and <Mono>--live</Mono> (sends real
            payloads, requires an API key). Output is a vulnerability rate and
            per-attack evidence.
          </P>
          <TerminalBlock
            caption="attack — adversarial fuzzing"
            lines={[
              { p: "$", t: "agentnotary attack --suite owasp-llm-top10           # dry-run", tone: "cmd" },
              { p: "$", t: "agentnotary attack --suite owasp-llm-top10 --live    # real payloads", tone: "cmd" },
              { p: "", t: "running  LLM01 prompt-injection ...", tone: "out" },
              { p: "", t: "running  LLM06 sensitive-info ...", tone: "out" },
              { p: "", t: "running  LLM08 excessive-agency ...", tone: "out" },
              { p: "", t: "vuln rate → attack_report.json", tone: "ok" },
            ]}
          />

          <H4>bom — AI Software Bill of Materials</H4>
          <P>
            Produces CycloneDX 1.6 (OWASP) or SPDX 2.3 (Linux Foundation)
            compliant SBOMs. Enumerates models, prompts, tools, MCP servers,
            and dependencies — each with a cryptographic hash. Intended for
            procurement and supply-chain audits.
          </P>
          <TerminalBlock
            caption="bom — AI-BOM generation"
            lines={[
              { p: "$", t: "agentnotary bom --format cyclonedx   # → agent.sbom.cdx.json", tone: "cmd" },
              { p: "$", t: "agentnotary bom --format spdx         # → agent.sbom.spdx.json", tone: "cmd" },
              { p: "", t: "enumerate  models(1) prompts(4) tools(3) deps", tone: "out" },
              { p: "", t: "✓ SBOM written", tone: "ok" },
            ]}
          />

          <H4>bench — cross-model cost vs accuracy</H4>
          <P>
            Runs your eval suite against multiple models in parallel and
            outputs an ASCII Pareto chart of cost versus accuracy. Without API
            keys it runs in dry-run mode, projecting cost from prompt size and
            a static pricing table. With keys it does live measurement.
          </P>
          <TerminalBlock
            caption="bench — Pareto comparison"
            lines={[
              { p: "$", t: "agentnotary bench --models claude-sonnet-4-5-20251022,gpt-4o,gemini-2.5-flash", tone: "cmd" },
              { p: "", t: "  acc%", tone: "out" },
              { p: "", t: "100 ┤         ◆ claude-sonnet-4-5", tone: "out" },
              { p: "", t: " 90 ┤    ◆ gpt-4o", tone: "out" },
              { p: "", t: " 80 ┤ ◆ gemini-2.5-flash", tone: "out" },
              { p: "", t: "    └──────────────────── $/1K tokens", tone: "out" },
            ]}
          />

          <H4>replay — time-travel debugger</H4>
          <P>
            Replay any recorded session, fork at any step, edit the prompt, and
            simulate forward. Steps before the fork replay deterministically.
            The diverged step uses a real LLM call only if an API key is
            present — otherwise it substitutes a deterministic stand-in so you
            can still inspect the branching structure.
          </P>
          <TerminalBlock
            caption="replay — fork and diverge"
            lines={[
              { p: "$", t: "agentnotary replay abc123", tone: "cmd" },
              { p: "$", t: "agentnotary replay abc123 --rewind --step 7 --edit 'What if...'", tone: "cmd" },
              { p: "", t: "fork   session abc123 @ step 7", tone: "out" },
              { p: "", t: "replay steps 1..6 (deterministic)", tone: "out" },
              { p: "", t: "diverge step 7 → live call (requires API key)", tone: "out" },
              { p: "", t: "trace  saved → sessions/abc123-fork.json", tone: "ok" },
            ]}
          />
        </article>
      </div>

      {/* ━━━ CH 3: INTERACTIVE COMMANDS REFERENCE ━━━━━━━━━━━━━━━━━━━━━━ */}
      <Commands />

      {/* ━━━ Article: full governance loop ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <ChapterDivider num={3} label="Full Governance Loop" />
        </div>
        <article>
          <H3 id="governance-loop">Running the full loop</H3>
          <P>
            Once your <Mono>agentnotary.yaml</Mono> is set up, the governance
            loop is six commands. You can run all of them locally before your
            first deploy, and then add <Mono>seal --verify</Mono> to CI.
          </P>
          <TerminalBlock
            caption="Full governance loop from the README"
            lines={[
              { p: "$", t: "agentnotary seal                                # notarize", tone: "cmd" },
              { p: "$", t: "agentnotary attack                               # adversarial check", tone: "cmd" },
              { p: "$", t: "agentnotary guard run -- python -m refund_bot    # enforce at runtime", tone: "cmd" },
              { p: "$", t: "agentnotary compliance --standard eu-ai-act      # certify", tone: "cmd" },
              { p: "$", t: "agentnotary bom --format cyclonedx               # AI-BOM for procurement", tone: "cmd" },
              { p: "$", t: "git add agentnotary.yaml agent.lock docs/ && git commit", tone: "cmd" },
              { p: "", t: "✓ agent notarized, tested, guarded, documented, and committed", tone: "ok" },
            ]}
          />

          {/* Terminal screenshot from the repo */}
          <figure className="my-10">
            <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#070707]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
                </div>
                <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                  agentnotary in action
                </div>
                <div className="w-10" />
              </div>
              <img
                src={mediaUrl("terminal.png")}
                alt="Terminal output from agentnotary commands"
                data-testid="blog-terminal-image"
                className="w-full object-contain bg-black"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs font-mono text-white/40 tracking-wider uppercase">
              Real CLI output from the repo
            </figcaption>
          </figure>
        </article>
      </div>

      {/* ━━━ CH 4: COMPARISON ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Comparison />

      {/* ━━━ Article: position + migration + roadmap ━━━━━━━━━━━━━━━━━━━ */}
      <div className="mx-auto max-w-3xl px-6 pb-4 pt-4">
        <div className="mb-8">
          <ChapterDivider num={4} label="Context" />
        </div>
        <article>
          <H3>How it fits alongside your stack</H3>
          <P>
            AgentNotary doesn't replace LangSmith, Langfuse, or any other
            observability tool. Those tools are good at tracing and evals.
            AgentNotary adds the things they don't have: a cryptographic lock
            file (<Mono>agent.lock</Mono>), a runtime proxy that actually
            blocks (not just alerts), compliance documentation generation, an
            adversarial test suite, and an AI-BOM. You can run both side by
            side.
          </P>
          <Pull>
            "They watch agents. AgentNotary certifies them."
          </Pull>

          <H3>Migrating from agentbox</H3>
          <P>
            AgentNotary was previously released as <Mono>agentbox</Mono>.
            v0.3.0 is the successor under the new name. Migration is
            straightforward:
          </P>
          <TerminalBlock
            caption="migrating from agentbox"
            lines={[
              { p: "$", t: "pip uninstall agentbox && pip install agentnotary", tone: "cmd" },
              { p: "", t: "# rename agentbox.yaml → agentnotary.yaml  (or leave it; both are read)", tone: "out" },
              { p: "", t: "# update apiVersion: agentbox/v0.2 → agentnotary/v0.2  (legacy accepted)", tone: "out" },
              { p: "", t: "# .agentbox/ state dirs continue to work alongside .agentnotary/", tone: "out" },
              { p: "", t: "✓ no manifest changes required", tone: "ok" },
            ]}
          />

          <H3>Roadmap</H3>
          <ul className="list-none pl-0 space-y-3 my-6">
            {[
              ["v0.3.0 (current)", "bom, bench, attack, replay --rewind"],
              ["v0.3.x", "Streaming proxy support in guard. NIST AI RMF and ISO 42001 compliance templates."],
              ["v0.4", "Sigstore-style cryptographic signing + transparency log for agent.lock. Behavioral fingerprinting (N-prompt probe panel instead of single-prompt)."],
              ["v0.5", "AgentNotary Hub — public registry of sealed agents. notarize push / notarize pull."],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-start gap-4 p-4 rounded-md border border-white/5 bg-[#0A0A0A]"
              >
                <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
                  {k}
                </span>
                <span className="text-white/70 text-sm leading-relaxed">{v}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* ━━━ CH 5: FEATURE OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div
                data-testid="features-eyebrow"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 border border-white/10 rounded-full px-3 py-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                All eight capabilities
              </div>
              <h3
                data-testid="features-heading"
                className="mt-5 font-semibold tracking-tighter text-white text-2xl sm:text-4xl leading-[1.05]"
              >
                Seal → Guard → Test → Certify.
              </h3>
              <p className="mt-4 text-white/60 text-sm sm:text-base max-w-xl leading-relaxed">
                Each command is independent. Use one or all eight. They compose
                cleanly into CI and work with any LLM framework.
              </p>
            </div>
            <a
              href="#commands"
              data-testid="features-browse-commands"
              className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white border-b border-white/10 hover:border-white/40 pb-1 transition-colors self-start"
            >
              Try the interactive terminal →
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
                  className="trace-card group relative bg-[#0A0A0A] border border-white/10 rounded-xl p-7 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-10 w-10 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-white/20 transition-colors">
                      <Icon className="h-4 w-4 text-white/90" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-white/40">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${a.dot} ${a.glow}`}
                      />
                      0{i + 1}
                    </div>
                  </div>
                  <div className="font-mono text-[11px] tracking-wider text-white/40 mb-2">
                    {f.tag}
                  </div>
                  <h4 className="text-white text-lg font-medium tracking-tight mb-3">
                    {f.title}
                  </h4>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {f.body}
                  </p>
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

      {/* ━━━ Article conclusion ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <ChapterDivider num={5} label="Get Started" />
        </div>
        <article>
          <H3 id="get-started">Start in under a minute.</H3>
          <TerminalBlock
            caption="quickstart from the README"
            lines={[
              { p: "$", t: "pip install agentnotary", tone: "cmd" },
              { p: "$", t: "mkdir my-agent && cd my-agent", tone: "cmd" },
              { p: "$", t: "agentnotary init refund-bot    # scaffolds agentnotary.yaml + prompts/", tone: "cmd" },
              { p: "", t: "# edit agentnotary.yaml ...", tone: "out" },
              { p: "$", t: "agentnotary seal", tone: "cmd" },
              { p: "$", t: "agentnotary attack", tone: "cmd" },
              { p: "$", t: "agentnotary guard run -- python -m refund_bot", tone: "cmd" },
              { p: "$", t: "agentnotary compliance --standard eu-ai-act", tone: "cmd" },
              { p: "$", t: "agentnotary bom --format cyclonedx", tone: "cmd" },
              { p: "$", t: "git add agentnotary.yaml agent.lock docs/ && git commit", tone: "cmd" },
            ]}
          />
          <P>
            Apache 2.0. Use it commercially, fork it, embed it. The{" "}
            <Mono>agent.lock</Mono> format is a public spec. Tests:{" "}
            <Mono>pytest tests/ -q</Mono> — 169 tests, ~8 seconds.
          </P>

          {/* Walkthrough video */}
          <figure className="my-12">
            <div className="rounded-xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_30px_80px_-30px_rgba(16,185,129,0.2)]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0A0A0A]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
                </div>
                <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                  walkthrough · AI-narrated
                </div>
                <div className="w-10" />
              </div>
              <video
                data-testid="blog-walkthrough-video"
                src={mediaUrl("walkthrough.mp4")}
                controls
                preload="metadata"
                poster={mediaUrl("hero.png")}
                className="w-full aspect-video bg-black"
              />
            </div>
          </figure>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href="https://github.com/CharanBharathula/agentnotary"
              target="_blank"
              rel="noreferrer"
              data-testid="blog-cta-github"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 rounded-md px-5 py-3 font-medium tracking-tight transition-all active:scale-[0.98]"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/CharanBharathula/agentnotary/releases/tag/v0.3.0"
              target="_blank"
              rel="noreferrer"
              data-testid="blog-cta-release"
              className="inline-flex items-center gap-2 bg-transparent border border-white/15 text-white hover:bg-white/5 hover:border-white/30 rounded-md px-5 py-3 transition-colors"
            >
              v0.3.0 release notes
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Author card */}
          <div className="mt-16 pt-10 border-t border-white/5">
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-lg font-semibold text-white/70 shrink-0">
                CB
              </div>
              <div>
                <div className="font-semibold text-white tracking-tight">
                  CharanBharathula
                </div>
                <div className="font-mono text-[11px] text-white/40 mt-0.5">
                  Author · AgentNotary
                </div>
                <p className="mt-3 text-white/55 text-sm leading-relaxed max-w-sm">
                  AgentNotary is Apache 2.0. Contributions welcome —
                  especially Sigstore integration, streaming proxy, and wider
                  attack corpus.
                </p>
                <a
                  href="https://github.com/CharanBharathula/agentnotary"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  github.com/CharanBharathula/agentnotary
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
