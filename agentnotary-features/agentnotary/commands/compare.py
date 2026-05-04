"""
agentnotary compare — Diff two agent.lock files.

Shows exactly what changed between two seals: model, prompt hashes, tool
list, dependency versions. Useful when "the version that worked yesterday"
no longer works today, or when promoting from staging to production.

Usage:
    agentnotary compare agent.lock.prod agent.lock.staging
    agentnotary compare --json a.lock b.lock
    agentnotary compare a.lock b.lock --only model,prompt

Exit codes:
    0  identical
    1  differences found
    2  cannot read input files
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable

import yaml

# Sections we know how to render in a friendly way; anything else falls
# through to a generic dict-diff path.
KNOWN_SECTIONS = ("model", "manifest", "prompts", "tools", "dependencies", "mcp", "probes")


@dataclass
class FieldDiff:
    section: str
    key: str
    a: Any
    b: Any
    kind: str   # "added" | "removed" | "changed" | "same"


@dataclass
class CompareReport:
    a_path: str
    b_path: str
    diffs: list[FieldDiff] = field(default_factory=list)

    @property
    def changed(self) -> list[FieldDiff]:
        return [d for d in self.diffs if d.kind != "same"]

    @property
    def identical(self) -> bool:
        return not self.changed


def _load(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return yaml.safe_load(path.read_text()) or {}
    except yaml.YAMLError:
        return None


def _flatten(d: Any, prefix: str = "") -> dict[str, Any]:
    """Flatten a nested dict into dot-paths for stable comparison."""
    out: dict[str, Any] = {}
    if isinstance(d, dict):
        for k, v in d.items():
            sub = f"{prefix}.{k}" if prefix else k
            out.update(_flatten(v, sub))
    elif isinstance(d, list):
        # Treat lists as ordered; stringify for compact diff
        out[prefix] = json.dumps(d, sort_keys=True)
    else:
        out[prefix] = d
    return out


def _diff_section(name: str, a: Any, b: Any) -> list[FieldDiff]:
    fa = _flatten(a or {})
    fb = _flatten(b or {})
    keys = sorted(set(fa) | set(fb))
    out: list[FieldDiff] = []
    for k in keys:
        in_a, in_b = k in fa, k in fb
        if in_a and not in_b:
            out.append(FieldDiff(name, k, fa[k], None, "removed"))
        elif in_b and not in_a:
            out.append(FieldDiff(name, k, None, fb[k], "added"))
        elif fa[k] != fb[k]:
            out.append(FieldDiff(name, k, fa[k], fb[k], "changed"))
        else:
            out.append(FieldDiff(name, k, fa[k], fb[k], "same"))
    return out


def run(a_path: Path, b_path: Path, only: list[str] | None = None) -> CompareReport | None:
    a = _load(a_path)
    b = _load(b_path)
    if a is None or b is None:
        return None
    report = CompareReport(a_path=str(a_path), b_path=str(b_path))

    sections = list(KNOWN_SECTIONS)
    # Include any custom top-level sections present in either lockfile
    for k in set(a) | set(b):
        if k not in sections:
            sections.append(k)
    if only:
        sections = [s for s in sections if s in set(only)]

    for s in sections:
        report.diffs.extend(_diff_section(s, a.get(s), b.get(s)))
    return report


# ─────────────────────────────────────────────────────────────────────────────
# Rendering
# ─────────────────────────────────────────────────────────────────────────────

_GREEN, _RED, _YELLOW, _DIM, _BOLD, _RESET = (
    "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[1m", "\033[0m"
)
_KIND_GLYPH = {"added": "+", "removed": "-", "changed": "~", "same": " "}
_KIND_COLOR = {"added": _GREEN, "removed": _RED, "changed": _YELLOW, "same": ""}


def _short(v: Any, width: int = 48) -> str:
    s = str(v)
    if len(s) <= width:
        return s
    return s[: width - 1] + "…"


def render_text(report: CompareReport, color: bool = True, show_same: bool = False) -> str:
    def c(s: str, code: str) -> str:
        return f"{code}{s}{_RESET}" if (color and code) else s

    out = []
    out.append(c("AgentNotary Compare", _BOLD))
    out.append(f"  a: {c(report.a_path, _DIM)}")
    out.append(f"  b: {c(report.b_path, _DIM)}")
    out.append("")

    diffs = report.diffs if show_same else report.changed
    if not diffs:
        out.append(c("  ✓ lockfiles are identical", _GREEN))
        return "\n".join(out)

    by_section: dict[str, list[FieldDiff]] = {}
    for d in diffs:
        by_section.setdefault(d.section, []).append(d)

    for section, items in by_section.items():
        out.append(c(f"  [{section}]", _BOLD))
        for d in items:
            glyph = _KIND_GLYPH[d.kind]
            col = _KIND_COLOR[d.kind]
            tag = c(f"{glyph} {d.kind.upper():<8}", col)
            if d.kind == "changed":
                out.append(
                    f"    {tag}  {d.key:<32}  {c(_short(d.a), _RED)} {c('→', _DIM)} {c(_short(d.b), _GREEN)}"
                )
            elif d.kind == "added":
                out.append(f"    {tag}  {d.key:<32}  {c(_short(d.b), _GREEN)}")
            elif d.kind == "removed":
                out.append(f"    {tag}  {d.key:<32}  {c(_short(d.a), _RED)}")
            else:
                out.append(f"    {tag}  {d.key:<32}  {_short(d.a)}")
        out.append("")

    summary = (
        f"  {sum(1 for d in report.changed if d.kind == 'added')} added · "
        f"{sum(1 for d in report.changed if d.kind == 'removed')} removed · "
        f"{sum(1 for d in report.changed if d.kind == 'changed')} changed"
    )
    out.append(c(summary, _BOLD))
    return "\n".join(out)


def render_json(report: CompareReport) -> str:
    return json.dumps(
        {
            "a": report.a_path,
            "b": report.b_path,
            "identical": report.identical,
            "diffs": [
                {"section": d.section, "key": d.key, "a": d.a, "b": d.b, "kind": d.kind}
                for d in report.changed
            ],
        },
        indent=2,
        default=str,
    )


# ─────────────────────────────────────────────────────────────────────────────
# CLI entry point
# ─────────────────────────────────────────────────────────────────────────────

def main(argv: Iterable[str] | None = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(prog="agentnotary compare")
    parser.add_argument("a", help="first agent.lock file")
    parser.add_argument("b", help="second agent.lock file")
    parser.add_argument("--only", help="comma-separated section list to compare")
    parser.add_argument("--show-same", action="store_true", help="include unchanged keys")
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--no-color", action="store_true")
    args = parser.parse_args(list(argv) if argv is not None else None)

    only = [s.strip() for s in args.only.split(",")] if args.only else None
    report = run(Path(args.a), Path(args.b), only=only)
    if report is None:
        print("error: cannot read one or both lock files", file=sys.stderr)
        return 2

    if args.json:
        print(render_json(report))
    else:
        print(render_text(report, color=not args.no_color, show_same=args.show_same))

    return 0 if report.identical else 1


if __name__ == "__main__":
    sys.exit(main())
