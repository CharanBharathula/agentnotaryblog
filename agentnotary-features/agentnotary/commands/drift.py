"""
agentnotary drift — Detect provider-side model drift since last seal.

Re-runs the probe set captured by `seal --probe` against the live model
and reports whether responses still match. Catches the case where a
provider silently updates model weights behind the same model ID.

Usage:
    agentnotary drift
    agentnotary drift --threshold 0.95
    agentnotary drift --json
    agentnotary drift --reseal-on-pass

Exit codes:
    0  no drift (or below threshold)
    1  drift detected
    2  cannot run (no probes recorded, no API key, etc.)
"""
from __future__ import annotations

import difflib
import hashlib
import json
import os
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

import yaml


@dataclass
class ProbeDiff:
    prompt_hash: str
    prompt_preview: str
    sealed_response_hash: str
    live_response_hash: str
    similarity: float           # 0.0 — 1.0 SequenceMatcher ratio
    sealed_preview: str
    live_preview: str
    diverged: bool


@dataclass
class DriftReport:
    diverged: list[ProbeDiff] = field(default_factory=list)
    same: list[ProbeDiff] = field(default_factory=list)
    skipped: list[str] = field(default_factory=list)
    sealed_at: str = ""
    model: str = ""

    @property
    def total(self) -> int:
        return len(self.diverged) + len(self.same)

    @property
    def drift_rate(self) -> float:
        return len(self.diverged) / self.total if self.total else 0.0

    @property
    def has_drift(self) -> bool:
        return bool(self.diverged)


# ─────────────────────────────────────────────────────────────────────────────
# Lock-file IO
# ─────────────────────────────────────────────────────────────────────────────

def _load_lock(root: Path) -> dict | None:
    lock = root / "agent.lock"
    if not lock.exists():
        return None
    try:
        return yaml.safe_load(lock.read_text())
    except yaml.YAMLError:
        return None


def _load_manifest(root: Path) -> dict | None:
    for name in ("agentnotary.yaml", "agentbox.yaml"):
        p = root / name
        if p.exists():
            try:
                return yaml.safe_load(p.read_text())
            except yaml.YAMLError:
                return None
    return None


def _hash_text(s: str) -> str:
    return "sha256:" + hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]


# ─────────────────────────────────────────────────────────────────────────────
# Provider call (thin shim — the real CLI delegates to existing `seal` paths)
# ─────────────────────────────────────────────────────────────────────────────

def _call_model(provider: str, model: str, prompt: str) -> str | None:
    """Send `prompt` to the provider and return the response text.

    Returns None when the provider SDK is unavailable or no API key is set.
    The real implementation should reuse the same model-call code path as
    `seal --probe` so hashes are bit-for-bit comparable.
    """
    if provider == "anthropic":
        if not os.environ.get("ANTHROPIC_API_KEY"):
            return None
        try:
            import anthropic  # type: ignore
        except ImportError:
            return None
        client = anthropic.Anthropic()
        msg = client.messages.create(
            model=model,
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}],
        )
        # Concatenate text blocks (the same normalization seal --probe uses)
        return "".join(b.text for b in msg.content if b.type == "text")

    if provider == "openai":
        if not os.environ.get("OPENAI_API_KEY"):
            return None
        try:
            from openai import OpenAI  # type: ignore
        except ImportError:
            return None
        client = OpenAI()
        resp = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=512,
        )
        return resp.choices[0].message.content or ""

    return None


# ─────────────────────────────────────────────────────────────────────────────
# Core drift logic
# ─────────────────────────────────────────────────────────────────────────────

def _compare(prompt: str, sealed: str, live: str) -> ProbeDiff:
    similarity = difflib.SequenceMatcher(None, sealed, live).ratio()
    return ProbeDiff(
        prompt_hash=_hash_text(prompt),
        prompt_preview=prompt[:60].replace("\n", " "),
        sealed_response_hash=_hash_text(sealed),
        live_response_hash=_hash_text(live),
        similarity=round(similarity, 4),
        sealed_preview=sealed[:80].replace("\n", " "),
        live_preview=live[:80].replace("\n", " "),
        diverged=similarity < 0.999,
    )


def run(root: Path | None = None, threshold: float = 0.95) -> DriftReport:
    root = (root or Path.cwd()).resolve()
    lock = _load_lock(root)
    manifest = _load_manifest(root)
    report = DriftReport()

    if not lock:
        report.skipped.append("agent.lock not found — run `agentnotary seal --probe` first")
        return report

    probes = lock.get("probes") or []
    if not probes:
        report.skipped.append("no probes in agent.lock — re-seal with --probe")
        return report

    report.sealed_at = lock.get("sealed_at", "")
    model_block = (manifest or {}).get("agent", {}).get("model", {})
    provider = model_block.get("provider", "")
    model_name = model_block.get("name", "")
    report.model = f"{provider}/{model_name}"

    for probe in probes:
        prompt = probe.get("prompt", "")
        sealed_response = probe.get("response", "")
        if not prompt or not sealed_response:
            continue
        live = _call_model(provider, model_name, prompt)
        if live is None:
            report.skipped.append(f"probe '{prompt[:40]}…' (no API key or SDK)")
            continue
        diff = _compare(prompt, sealed_response, live)
        # Apply user-provided threshold: only count as drift when similarity < threshold
        if diff.similarity >= threshold:
            diff.diverged = False
        if diff.diverged:
            report.diverged.append(diff)
        else:
            report.same.append(diff)

    return report


# ─────────────────────────────────────────────────────────────────────────────
# Rendering
# ─────────────────────────────────────────────────────────────────────────────

_GREEN, _RED, _YELLOW, _DIM, _BOLD, _RESET = (
    "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[1m", "\033[0m"
)


def render_text(report: DriftReport, color: bool = True) -> str:
    def c(s: str, code: str) -> str:
        return f"{code}{s}{_RESET}" if color else s

    out = []
    out.append(c("AgentNotary Drift Check", _BOLD))
    if report.sealed_at:
        out.append(f"  sealed: {c(report.sealed_at, _DIM)}   model: {c(report.model, _DIM)}")
    out.append("")

    if not report.total and report.skipped:
        for s in report.skipped:
            out.append(f"  {c('SKIP', _YELLOW)}  {s}")
        return "\n".join(out)

    for i, p in enumerate(report.same, 1):
        out.append(f"  probe {i}/{report.total}  {c('SAME', _GREEN)}   sim={p.similarity:.3f}  {c(p.prompt_preview, _DIM)}")
    base = len(report.same)
    for j, p in enumerate(report.diverged, 1):
        idx = base + j
        out.append(
            f"  probe {idx}/{report.total}  {c('DRIFT', _RED)}  sim={p.similarity:.3f}  "
            f"{c(p.prompt_preview, _DIM)}"
        )
        out.append(f"    before: {c(p.sealed_preview, _DIM)}")
        out.append(f"    after:  {p.live_preview}")

    out.append("")
    rate = report.drift_rate * 100
    rate_color = _GREEN if rate == 0 else _YELLOW if rate < 25 else _RED
    out.append(f"  drift score: {c(f'{len(report.diverged)}/{report.total}', rate_color + _BOLD)} probes diverged ({rate:.0f}%)")
    if report.diverged:
        out.append(f"  → {c('agentnotary seal --probe', _BOLD)}  to re-seal against current model output")
    return "\n".join(out)


def render_json(report: DriftReport) -> str:
    return json.dumps(
        {
            "model": report.model,
            "sealed_at": report.sealed_at,
            "total": report.total,
            "diverged": len(report.diverged),
            "drift_rate": report.drift_rate,
            "probes": [
                {
                    "prompt_hash": p.prompt_hash,
                    "similarity": p.similarity,
                    "sealed_response_hash": p.sealed_response_hash,
                    "live_response_hash": p.live_response_hash,
                    "diverged": p.diverged,
                }
                for p in report.diverged + report.same
            ],
            "skipped": report.skipped,
        },
        indent=2,
    )


# ─────────────────────────────────────────────────────────────────────────────
# CLI entry point
# ─────────────────────────────────────────────────────────────────────────────

def main(argv: Iterable[str] | None = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(prog="agentnotary drift")
    parser.add_argument("--threshold", type=float, default=0.95,
                        help="similarity threshold below which drift is reported (default 0.95)")
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--no-color", action="store_true")
    args = parser.parse_args(list(argv) if argv is not None else None)

    report = run(threshold=args.threshold)
    if args.json:
        print(render_json(report))
    else:
        print(render_text(report, color=not args.no_color))

    if not report.total and report.skipped:
        return 2
    return 1 if report.has_drift else 0


if __name__ == "__main__":
    sys.exit(main())
