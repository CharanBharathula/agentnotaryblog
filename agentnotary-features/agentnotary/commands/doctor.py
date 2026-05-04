"""
agentnotary doctor — One-command project health check.

Runs every available governance check, reports a pass/warn/fail punch-list,
and computes a single 0-100 AgentNotary Score.

Usage:
    agentnotary doctor
    agentnotary doctor --json            # machine-readable
    agentnotary doctor --fix             # auto-suggest commands to run
    agentnotary doctor --strict          # exit non-zero on WARN

Exit codes:
    0  all PASS (or only WARN without --strict)
    1  one or more FAIL
    2  --strict and one or more WARN
"""
from __future__ import annotations

import json
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Literal

import yaml

Status = Literal["PASS", "WARN", "FAIL", "SKIP"]


@dataclass
class Check:
    name: str
    status: Status
    message: str
    fix_command: str | None = None
    weight: int = 10  # contribution to the 0-100 score


@dataclass
class Report:
    checks: list[Check] = field(default_factory=list)
    started_at: float = field(default_factory=time.time)

    @property
    def score(self) -> int:
        if not self.checks:
            return 0
        total_weight = sum(c.weight for c in self.checks if c.status != "SKIP")
        if total_weight == 0:
            return 0
        earned = sum(
            c.weight if c.status == "PASS"
            else c.weight * 0.5 if c.status == "WARN"
            else 0
            for c in self.checks
        )
        return int(round(100 * earned / total_weight))

    @property
    def has_failures(self) -> bool:
        return any(c.status == "FAIL" for c in self.checks)

    @property
    def has_warnings(self) -> bool:
        return any(c.status == "WARN" for c in self.checks)


# ─────────────────────────────────────────────────────────────────────────────
# Individual checks. Each returns a Check.
# ─────────────────────────────────────────────────────────────────────────────

def check_manifest_exists(root: Path) -> Check:
    candidates = [root / "agentnotary.yaml", root / "agentbox.yaml"]
    found = next((p for p in candidates if p.exists()), None)
    if found:
        return Check(
            name="manifest",
            status="PASS",
            message=f"manifest found at {found.relative_to(root)}",
            weight=15,
        )
    return Check(
        name="manifest",
        status="FAIL",
        message="no agentnotary.yaml found in project root",
        fix_command="agentnotary init <agent-name>",
        weight=15,
    )


def check_seal(root: Path) -> Check:
    lock = root / "agent.lock"
    if not lock.exists():
        return Check(
            name="seal",
            status="FAIL",
            message="agent.lock missing — agent has never been sealed",
            fix_command="agentnotary seal",
            weight=15,
        )
    age_seconds = time.time() - lock.stat().st_mtime
    age_days = age_seconds / 86_400
    if age_days > 30:
        return Check(
            name="seal",
            status="WARN",
            message=f"agent.lock is {age_days:.0f} days old — re-seal recommended",
            fix_command="agentnotary seal",
            weight=15,
        )
    return Check(
        name="seal",
        status="PASS",
        message=f"agent.lock current (sealed {_humanize(age_seconds)} ago)",
        weight=15,
    )


def check_guardrails(manifest: dict | None) -> Check:
    if not manifest:
        return Check(name="guardrails", status="SKIP", message="no manifest", weight=0)
    g = manifest.get("agent", {}).get("guardrails") or {}
    if not g:
        return Check(
            name="guardrails",
            status="FAIL",
            message="no guardrails block in manifest — agent runs unbounded",
            fix_command="add a guardrails: block to agentnotary.yaml",
            weight=20,
        )
    missing = []
    if not g.get("cost"):
        missing.append("cost")
    if not g.get("iterations"):
        missing.append("iterations")
    if not g.get("rate"):
        missing.append("rate")
    if missing:
        return Check(
            name="guardrails",
            status="WARN",
            message=f"guardrails missing: {', '.join(missing)}",
            fix_command="add the missing dimensions under guardrails:",
            weight=20,
        )
    return Check(
        name="guardrails",
        status="PASS",
        message="cost · iterations · rate all configured",
        weight=20,
    )


def check_pii(manifest: dict | None) -> Check:
    if not manifest:
        return Check(name="pii", status="SKIP", message="no manifest", weight=0)
    pii = (manifest.get("agent", {}).get("guardrails") or {}).get("pii")
    handles_pii = (
        manifest.get("agent", {})
        .get("compliance", {})
        .get("data_handling", {})
        .get("processes_pii", False)
    )
    if handles_pii and not pii:
        return Check(
            name="pii",
            status="FAIL",
            message="manifest declares processes_pii: true but no pii guard configured",
            fix_command="add guardrails.pii with patterns and action",
            weight=15,
        )
    if pii:
        return Check(
            name="pii",
            status="PASS",
            message=f"pii guard active: {pii.get('action', 'redact')} on {len(pii.get('patterns', []))} patterns",
            weight=15,
        )
    return Check(
        name="pii",
        status="WARN",
        message="no pii guard configured (ok if agent never sees user data)",
        weight=15,
    )


def check_attack_history(root: Path) -> Check:
    report = root / ".agentnotary" / "attack_report.json"
    if not report.exists():
        return Check(
            name="attack",
            status="WARN",
            message="never adversarially tested",
            fix_command="agentnotary attack --dry-run",
            weight=15,
        )
    age_days = (time.time() - report.stat().st_mtime) / 86_400
    if age_days > 30:
        return Check(
            name="attack",
            status="WARN",
            message=f"last attack run was {age_days:.0f} days ago",
            fix_command="agentnotary attack",
            weight=15,
        )
    try:
        data = json.loads(report.read_text())
        vuln = data.get("vulnerability_rate")
        if isinstance(vuln, (int, float)) and vuln > 0.10:
            return Check(
                name="attack",
                status="FAIL",
                message=f"vulnerability rate {vuln*100:.1f}% (threshold 10%)",
                fix_command="review attack_report.json and tighten guardrails",
                weight=15,
            )
    except (json.JSONDecodeError, OSError):
        pass
    return Check(
        name="attack",
        status="PASS",
        message=f"attack report current ({age_days:.0f}d old)",
        weight=15,
    )


def check_compliance(root: Path, manifest: dict | None) -> Check:
    if not manifest:
        return Check(name="compliance", status="SKIP", message="no manifest", weight=0)
    if not manifest.get("agent", {}).get("compliance"):
        return Check(
            name="compliance",
            status="WARN",
            message="no compliance block in manifest",
            fix_command="add compliance: with risk_class and intended_purpose",
            weight=10,
        )
    docs = root / "docs" / "eu-ai-act"
    if not docs.exists():
        return Check(
            name="compliance",
            status="WARN",
            message="compliance block declared but no Annex IV docs generated",
            fix_command="agentnotary compliance --standard eu-ai-act",
            weight=10,
        )
    return Check(
        name="compliance",
        status="PASS",
        message="compliance block + Annex IV docs present",
        weight=10,
    )


def check_system_prompt(root: Path, manifest: dict | None) -> Check:
    if not manifest:
        return Check(name="prompt", status="SKIP", message="no manifest", weight=0)
    rel = manifest.get("agent", {}).get("system_prompt_file")
    if not rel:
        return Check(
            name="prompt",
            status="WARN",
            message="no system_prompt_file declared",
            weight=5,
        )
    if not (root / rel).exists():
        return Check(
            name="prompt",
            status="FAIL",
            message=f"system_prompt_file points to missing file: {rel}",
            weight=5,
        )
    return Check(
        name="prompt",
        status="PASS",
        message=f"system prompt found: {rel}",
        weight=5,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Orchestration
# ─────────────────────────────────────────────────────────────────────────────

def _load_manifest(root: Path) -> dict | None:
    for name in ("agentnotary.yaml", "agentbox.yaml"):
        p = root / name
        if p.exists():
            try:
                return yaml.safe_load(p.read_text())
            except yaml.YAMLError:
                return None
    return None


def _humanize(seconds: float) -> str:
    if seconds < 60:
        return f"{int(seconds)}s"
    if seconds < 3600:
        return f"{int(seconds // 60)}m"
    if seconds < 86_400:
        return f"{int(seconds // 3600)}h"
    return f"{int(seconds // 86_400)}d"


def run(root: Path | None = None) -> Report:
    root = (root or Path.cwd()).resolve()
    manifest = _load_manifest(root)

    report = Report()
    report.checks.append(check_manifest_exists(root))
    report.checks.append(check_seal(root))
    report.checks.append(check_guardrails(manifest))
    report.checks.append(check_pii(manifest))
    report.checks.append(check_system_prompt(root, manifest))
    report.checks.append(check_attack_history(root))
    report.checks.append(check_compliance(root, manifest))
    return report


# ─────────────────────────────────────────────────────────────────────────────
# Rendering
# ─────────────────────────────────────────────────────────────────────────────

_GLYPH = {"PASS": "✓", "WARN": "!", "FAIL": "✗", "SKIP": "·"}
_COLOR = {
    "PASS": "\033[32m",  # green
    "WARN": "\033[33m",  # yellow
    "FAIL": "\033[31m",  # red
    "SKIP": "\033[90m",  # grey
}
_RESET = "\033[0m"
_DIM = "\033[2m"
_BOLD = "\033[1m"


def render_text(report: Report, fix: bool = False, color: bool = True) -> str:
    def c(s: str, code: str) -> str:
        return f"{code}{s}{_RESET}" if color else s

    lines = []
    lines.append(f"{c('AgentNotary Doctor', _BOLD)} — checking project health")
    lines.append("")
    for ch in report.checks:
        glyph = _GLYPH[ch.status]
        col = _COLOR[ch.status]
        lines.append(
            f"  {c(f'[{glyph}] {ch.status:<4}', col)}  "
            f"{c(ch.name, _BOLD):<24}  {ch.message}"
        )
    lines.append("")

    if fix:
        suggestions = [c for c in report.checks if c.fix_command and c.status in ("WARN", "FAIL")]
        if suggestions:
            lines.append(c("Suggested next steps:", _BOLD))
            for ch in suggestions:
                lines.append(f"  → {c(ch.fix_command, _DIM)}   # {ch.name}")
            lines.append("")

    score = report.score
    score_color = (
        _COLOR["PASS"] if score >= 80
        else _COLOR["WARN"] if score >= 50
        else _COLOR["FAIL"]
    )
    lines.append(f"  AgentNotary Score: {c(str(score) + '/100', score_color + _BOLD)}")

    badge = _badge_url(score)
    lines.append(f"  Badge: {c(badge, _DIM)}")
    return "\n".join(lines)


def render_json(report: Report) -> str:
    return json.dumps(
        {
            "score": report.score,
            "checks": [
                {
                    "name": c.name,
                    "status": c.status,
                    "message": c.message,
                    "fix_command": c.fix_command,
                    "weight": c.weight,
                }
                for c in report.checks
            ],
            "badge_url": _badge_url(report.score),
        },
        indent=2,
    )


def _badge_url(score: int) -> str:
    color = "brightgreen" if score >= 80 else "yellow" if score >= 50 else "red"
    return f"https://img.shields.io/badge/agentnotary-{score}%2F100-{color}"


# ─────────────────────────────────────────────────────────────────────────────
# CLI entry point
# ─────────────────────────────────────────────────────────────────────────────

def main(argv: Iterable[str] | None = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(prog="agentnotary doctor")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    parser.add_argument("--fix", action="store_true", help="show suggested commands")
    parser.add_argument("--strict", action="store_true", help="exit non-zero on WARN")
    parser.add_argument("--no-color", action="store_true", help="disable ANSI colors")
    args = parser.parse_args(list(argv) if argv is not None else None)

    report = run()
    if args.json:
        print(render_json(report))
    else:
        print(render_text(report, fix=args.fix, color=not args.no_color))

    if report.has_failures:
        return 1
    if args.strict and report.has_warnings:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
