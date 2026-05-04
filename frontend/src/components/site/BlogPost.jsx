import { motion } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function BlogPost() {
  return (
    <section id="blog" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 border border-white/10 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Deep Dive · Long Form
          </div>
          <h2
            data-testid="blog-title"
            className="mt-6 font-semibold tracking-tighter text-white text-3xl sm:text-5xl lg:text-6xl leading-[1.02]"
          >
            Why Agentic Trust is the Next Big Frontier in AI.
          </h2>
          <div className="mt-6 flex items-center gap-4 text-sm text-white/50 font-mono">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[10px]">
                CB
              </div>
              <span className="text-white/70">CharanBharathula</span>
            </div>
            <span>·</span>
            <span>12 min read</span>
            <span>·</span>
            <span>v0.3.0 release notes</span>
          </div>
        </div>

        {/* Hero image for blog post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A]"
        >
          <img
            src={`${BACKEND_URL}/api/media/repo.png`}
            alt="AgentNotary repository"
            data-testid="blog-hero-image"
            className="w-full aspect-[16/9] object-cover object-top"
          />
        </motion.div>

        <article className="prose-custom">
          <Lead>
            Autonomous agents are the future. But their power comes with
            unprecedented risk. How do you govern what an agent{" "}
            <em>thinks</em>? How do you audit an AI that rewrites its own plan
            mid-execution?{" "}
            <strong className="text-white">AgentNotary</strong> is the trust
            primitive that answers those questions — and it shipped open-source
            in v0.3.0.
          </Lead>

          <H3>The ground shifted, but our tools didn't.</H3>
          <P>
            97% of companies have deployed AI agents. 82% can't name which agents
            are running in production. Read that again. The observability stack
            we've built over the last two years —{" "}
            <Mono>LangSmith</Mono>, <Mono>Langfuse</Mono>, <Mono>Helicone</Mono>,{" "}
            <Mono>AgentOps</Mono> — does one thing extraordinarily well:{" "}
            <em>it watches what already happened.</em>
          </P>
          <P>
            That's fine for debugging. It's catastrophic for governance. None of
            those tools <em>prevent</em> a runaway loop, <em>prove</em> an agent
            hasn't drifted, <em>document</em> it for regulators, or{" "}
            <em>probe</em> it for injections. AgentNotary occupies that empty
            position — the notary public for AI agents.
          </P>

          <Pull>
            "Every existing tool is passive. AgentNotary intercepts. It doesn't
            watch agents — it certifies them."
          </Pull>

          {/* Synced walkthrough video */}
          <figure className="my-12">
            <div className="rounded-xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_30px_80px_-30px_rgba(16,185,129,0.2)]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0A0A0A]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
                </div>
                <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                  walkthrough.mp4 · AI-narrated · 0:29
                </div>
                <div className="w-10" />
              </div>
              <video
                data-testid="blog-walkthrough-video"
                src={`${BACKEND_URL}/api/media/walkthrough.mp4`}
                controls
                preload="metadata"
                poster={`${BACKEND_URL}/api/media/hero.png`}
                className="w-full aspect-video bg-black"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs font-mono text-white/40 tracking-wider uppercase">
              Video: the governance loop in 29 seconds · voice-over generated with OpenAI TTS
            </figcaption>
          </figure>

          <H3>The eight commands that make an agent notarizable.</H3>
          <P>
            The repository ships eight composable commands organised into three
            layers: <strong className="text-white">Notarize & Govern</strong>{" "}
            (seal, guard, compliance), <strong className="text-white">Audit & Test</strong>{" "}
            (bom, bench, attack, replay), and the{" "}
            <strong className="text-white">Develop / Versioning</strong>{" "}
            utilities (init, validate, tag, rollback, sessions, scan). Each one
            produces a deterministic, cryptographically verifiable artifact you
            can diff in CI.
          </P>

          <TerminalBlock
            caption="The core governance loop, end-to-end"
            lines={[
              { p: "$", t: "agentnotary init refund-bot", tone: "cmd" },
              { p: "$", t: "agentnotary seal --probe", tone: "cmd" },
              { p: "", t: "✓ agent.lock sealed · 0 drift · probe hash pinned", tone: "ok" },
              { p: "$", t: "agentnotary attack --suite owasp-llm-top10", tone: "cmd" },
              { p: "", t: "vuln rate 8.5% · report → attack_report.json", tone: "ok" },
              { p: "$", t: "agentnotary guard run -- python refund_bot.py", tone: "cmd" },
              { p: "", t: "BLOCK cost exceeded @ call 14 · 403 billing_hard_limit_reached", tone: "err" },
              { p: "$", t: "agentnotary compliance --standard eu-ai-act", tone: "cmd" },
              { p: "", t: "✓ Annex IV scaffold · 28 sections · counsel review required", tone: "warn" },
            ]}
          />

          <H3>Why <Mono>seal</Mono> matters more than you think.</H3>
          <P>
            A prompt is code. Tool source is code. System prompts, MCP package
            versions, model weights that providers silently update behind the
            same model ID — all of it is code. But unlike your application
            binary, none of it has a lockfile.{" "}
            <Mono>agentnotary seal</Mono> is the Cargo.lock for AI agents.
          </P>

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
                  terminal · agentnotary seal · attack · guard
                </div>
                <div className="w-10" />
              </div>
              <img
                src={`${BACKEND_URL}/api/media/terminal.png`}
                alt="Terminal output from agentnotary commands"
                data-testid="blog-terminal-image"
                className="w-full object-contain bg-black"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs font-mono text-white/40 tracking-wider uppercase">
              Real CLI output — deterministic, diffable, CI-ready
            </figcaption>
          </figure>

          <P>
            Hashed in v0.3.0: the manifest, raw and normalized prompts, tool
            source code, MCP package versions, dependencies, and optionally a
            probe-response hash for provider-drift detection. Run{" "}
            <Mono>seal --verify</Mono> in CI and the pipeline fails the moment
            anything moves. The format is a public spec — the stated goal is to
            get <Mono>agent.lock</Mono> onto every agent in production.
          </P>

          <H3>Why <Mono>guard</Mono> is the only primitive that actually protects you.</H3>
          <P>
            <Mono>guard</Mono> is a local HTTP reverse proxy. Framework-agnostic.
            It blocks calls at the API boundary based on typed guardrails —{" "}
            <Mono>cost</Mono>, <Mono>iterations</Mono>, <Mono>tools</Mono>,{" "}
            <Mono>pii</Mono>, <Mono>content</Mono>, <Mono>rate</Mono>. When a
            policy fires it returns a <em>provider-shaped 403</em> so your SDK
            raises its native exception class. Your code didn't change. The
            runaway stops.
          </P>
          <P>
            Every other tool on the market is passive. They send you a Slack
            alert at 3 AM after the bill hits $4,000. <Mono>guard</Mono> would
            have stopped it at $0.50 — before call #15 left the box.
          </P>

          <H3>Why the EU AI Act changes everything on August 2, 2026.</H3>
          <P>
            Enforcement begins in nine months. Annex IV requires technical
            documentation of intended purpose, risk class, data handling,
            performance metrics, and the human-oversight regime. You cannot
            generate that from a LangSmith trace.{" "}
            <Mono>agentnotary compliance --standard eu-ai-act</Mono> emits a
            deterministic scaffold in both Markdown (for engineers) and JSON
            (for GRC tools).
          </P>
          <P>
            The risk classifier is deliberately <em>not an LLM call</em> — it's
            a rule engine. Every classification cites the rule that fired:{" "}
            <Mono>EU-AI-ACT-ANNEX-III-payment</Mono> triggered by the keyword{" "}
            <Mono>payment</Mono> in <Mono>tools/description</Mono>. A compliance
            officer can audit the classifier itself. Important caveat: the repo
            is explicit that generated documentation is a <em>scaffold</em>,
            not legal advice. Counsel review is required before submission.
          </P>

          <H3>Adversarial fuzzing isn't theatre.</H3>
          <P>
            <Mono>agentnotary attack --suite owasp-llm-top10</Mono> ships a real
            attack corpus covering prompt injection, insecure output handling,
            sensitive information disclosure, excessive agency, and more. Two
            modes: <Mono>--dry-run</Mono> (predicts blockability from manifest)
            and <Mono>--live</Mono> (actually sends the payloads and measures).
            You get a vulnerability rate and per-attack evidence. It's the
            closest thing to Burp Suite that the agentic stack has had.
          </P>

          <Pull>
            "Think of it this way: <Mono>seal</Mono> is Cargo.lock,{" "}
            <Mono>guard</Mono> is an IPTables rule, <Mono>attack</Mono> is
            Burp Suite, and <Mono>compliance</Mono> is Terraform plan — all for
            agents, all in one CLI, all open source."
          </Pull>

          <H3>The AI-BOM, the Pareto bench, and the time-travel debugger.</H3>
          <P>
            Three more commands ship in v0.3.0 that solve problems nobody else
            is even aiming at:
          </P>
          <ul className="list-none pl-0 space-y-3 my-6">
            {[
              ["bom",  "CycloneDX 1.6 + SPDX 2.3 compliant SBOMs. Models, prompts, tools, MCP servers, and deps — each cryptographically hashed. Procurement-ready."],
              ["bench","Parallel cross-model eval with an ASCII Pareto chart of cost vs accuracy. Without keys: projects cost from prompt size + static pricing. With keys: live measurement."],
              ["replay --rewind","Fork any recorded session at any step, edit the prompt, simulate forward. Without a key: deterministic stand-in. With a key: real LLM call for the diverged step only."],
            ].map(([k, v]) => (
              <li key={k} className="flex items-start gap-4 p-4 rounded-md border border-white/5 bg-[#0A0A0A]">
                <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded shrink-0">
                  {k}
                </span>
                <span className="text-white/70 text-sm leading-relaxed">{v}</span>
              </li>
            ))}
          </ul>

          <H3>From <Mono>agentbox</Mono> to AgentNotary: a positioning move.</H3>
          <P>
            v0.3.0 also ships a rebrand. The prior name (<Mono>agentbox</Mono>)
            had become synonymous with sandbox/container projects — a different
            concept. AgentNotary positions the tool where it actually belongs:{" "}
            <em>the notary public for AI agents.</em> It certifies, seals,
            witnesses, archives, and produces evidence. Backwards compatibility
            is preserved end-to-end; old manifests parse with a one-line stderr
            warning.
          </P>

          <H3>The roadmap is the point.</H3>
          <P>
            v0.3.x adds streaming-proxy support and NIST AI RMF / ISO 42001
            templates. v0.4 brings Sigstore-style cryptographic signing and a
            transparency log for <Mono>agent.lock</Mono>. v0.5 — AgentNotary Hub,
            a public registry of sealed agents with <Mono>notarize push</Mono>{" "}
            and <Mono>notarize pull</Mono>. The ambition is a public, federated
            trust infrastructure for the autonomous stack. Every agent
            notarized. Every drift detected. Every regulator satisfied.
          </P>

          <H3>How to start, today.</H3>
          <TerminalBlock
            caption="Install and ship the governance loop"
            lines={[
              { p: "$", t: "pip install agentnotary", tone: "cmd" },
              { p: "$", t: "agentnotary init my-agent && cd my-agent", tone: "cmd" },
              { p: "$", t: "agentnotary seal", tone: "cmd" },
              { p: "$", t: "agentnotary attack", tone: "cmd" },
              { p: "$", t: "agentnotary compliance --standard eu-ai-act", tone: "cmd" },
              { p: "$", t: "agentnotary bom --format cyclonedx", tone: "cmd" },
              { p: "",  t: "→ commit agentnotary.yaml + agent.lock + docs/  ✓", tone: "ok" },
            ]}
          />

          <P>
            Apache 2.0. Use it commercially, fork it, embed it. Just keep the
            notice. The <Mono>agent.lock</Mono> format is a public spec. The
            author wants it on every agent in production — and so should you.
          </P>

          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href="https://github.com/CharanBharathula/agentnotary"
              target="_blank"
              rel="noreferrer"
              data-testid="blog-cta-github"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 rounded-md px-5 py-3 font-medium tracking-tight transition-all active:scale-[0.98]"
            >
              <Github className="h-4 w-4" />
              Read the repository
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
        </article>
      </div>
    </section>
  );
}

function Lead({ children }) {
  return (
    <p className="text-lg sm:text-xl text-white/80 leading-[1.7] mb-10 border-l-2 border-emerald-400/60 pl-6">
      {children}
    </p>
  );
}
function H3({ children }) {
  return (
    <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mt-14 mb-5 leading-snug">
      {children}
    </h3>
  );
}
function P({ children }) {
  return (
    <p className="text-white/70 text-base sm:text-[17px] leading-[1.8] mb-5">
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
