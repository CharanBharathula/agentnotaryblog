"""Tests for agentnotary compare."""
from __future__ import annotations

import json
from pathlib import Path

import pytest
import yaml

from agentnotary.commands import compare


def _write_lock(path: Path, data: dict) -> Path:
    path.write_text(yaml.safe_dump(data))
    return path


@pytest.fixture
def base_lock() -> dict:
    return {
        "model": {"provider": "anthropic", "name": "claude-sonnet-4-5-20251022", "temperature": 0.2},
        "prompts": {"system.md": "sha256:8af3a01c"},
        "tools": ["lookup_order", "process_refund"],
        "dependencies": {"anthropic": "0.40.0", "pyyaml": "6.0.1"},
    }


def test_identical_lockfiles(tmp_path: Path, base_lock: dict):
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", base_lock)
    report = compare.run(a, b)
    assert report is not None
    assert report.identical


def test_changed_model(tmp_path: Path, base_lock: dict):
    other = dict(base_lock)
    other["model"] = {**base_lock["model"], "name": "claude-sonnet-4-6"}
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", other)
    report = compare.run(a, b)
    assert report is not None and not report.identical
    changed = [d for d in report.changed if d.kind == "changed"]
    assert any(d.key == "name" for d in changed)


def test_added_tool(tmp_path: Path, base_lock: dict):
    other = dict(base_lock)
    other["tools"] = base_lock["tools"] + ["new_tool"]
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", other)
    report = compare.run(a, b)
    assert report is not None
    # tools list is stringified — kind will be "changed" not "added", but the
    # rendered diff still surfaces it
    assert not report.identical


def test_only_filter(tmp_path: Path, base_lock: dict):
    other = dict(base_lock)
    other["model"] = {**base_lock["model"], "temperature": 0.7}
    other["dependencies"] = {**base_lock["dependencies"], "pyyaml": "6.0.2"}
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", other)
    report = compare.run(a, b, only=["model"])
    assert report is not None
    sections = {d.section for d in report.changed}
    assert sections == {"model"}


def test_missing_file(tmp_path: Path):
    out = compare.run(tmp_path / "no.lock", tmp_path / "still-no.lock")
    assert out is None


def test_render_json(tmp_path: Path, base_lock: dict):
    other = dict(base_lock)
    other["model"] = {**base_lock["model"], "temperature": 0.9}
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", other)
    report = compare.run(a, b)
    payload = json.loads(compare.render_json(report))
    assert payload["identical"] is False
    assert any(d["section"] == "model" for d in payload["diffs"])


def test_render_text_shows_arrow(tmp_path: Path, base_lock: dict):
    other = dict(base_lock)
    other["model"] = {**base_lock["model"], "name": "gpt-4o"}
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", other)
    out = compare.render_text(compare.run(a, b), color=False)
    assert "claude-sonnet-4-5-20251022" in out
    assert "gpt-4o" in out
    assert "→" in out


def test_main_exit_codes(tmp_path: Path, base_lock: dict, capsys):
    a = _write_lock(tmp_path / "a.lock", base_lock)
    b = _write_lock(tmp_path / "b.lock", base_lock)
    assert compare.main([str(a), str(b), "--no-color"]) == 0

    other = dict(base_lock)
    other["model"] = {**base_lock["model"], "name": "different"}
    c = _write_lock(tmp_path / "c.lock", other)
    assert compare.main([str(a), str(c), "--no-color"]) == 1
