"""Tests for agentnotary doctor."""
from __future__ import annotations

import json
from pathlib import Path

import pytest
import yaml

from agentnotary.commands import doctor


@pytest.fixture
def empty_project(tmp_path: Path) -> Path:
    return tmp_path


@pytest.fixture
def healthy_project(tmp_path: Path) -> Path:
    manifest = {
        "agent": {
            "name": "refund-bot",
            "version": "0.1.0",
            "framework": "anthropic",
            "model": {"provider": "anthropic", "name": "claude-sonnet-4-5-20251022"},
            "system_prompt_file": "prompts/system.md",
            "guardrails": {
                "cost": {"max_usd_per_session": 0.5, "action": "block"},
                "iterations": {"max_llm_calls": 25, "action": "block"},
                "rate": {"max_calls_per_minute": 60},
                "pii": {"patterns": ["EMAIL", "SSN"], "action": "redact", "direction": "both"},
            },
            "compliance": {"risk_class": "limited", "intended_purpose": "refunds"},
        }
    }
    (tmp_path / "agentnotary.yaml").write_text(yaml.safe_dump(manifest))
    (tmp_path / "agent.lock").write_text("manifest_hash: sha256:abc\nprobes: []\n")
    (tmp_path / "prompts").mkdir()
    (tmp_path / "prompts" / "system.md").write_text("you are a refund assistant.")
    (tmp_path / ".agentnotary").mkdir()
    (tmp_path / ".agentnotary" / "attack_report.json").write_text(
        json.dumps({"vulnerability_rate": 0.04})
    )
    (tmp_path / "docs" / "eu-ai-act").mkdir(parents=True)
    return tmp_path


def test_empty_project_fails(empty_project: Path):
    report = doctor.run(empty_project)
    assert report.has_failures
    assert report.score < 50
    names = {c.name for c in report.checks if c.status == "FAIL"}
    assert "manifest" in names
    assert "seal" in names


def test_healthy_project_scores_high(healthy_project: Path):
    report = doctor.run(healthy_project)
    assert not report.has_failures
    assert report.score >= 80


def test_missing_pii_when_processing_pii_fails(tmp_path: Path):
    manifest = {
        "agent": {
            "name": "x",
            "compliance": {
                "data_handling": {"processes_pii": True, "pii_categories": ["email"]}
            },
            "guardrails": {},  # no pii guard
        }
    }
    (tmp_path / "agentnotary.yaml").write_text(yaml.safe_dump(manifest))
    pii_check = doctor.check_pii(manifest)
    assert pii_check.status == "FAIL"


def test_stale_seal_warns(tmp_path: Path):
    import os, time
    (tmp_path / "agentnotary.yaml").write_text("agent: {name: x}\n")
    lock = tmp_path / "agent.lock"
    lock.write_text("manifest_hash: x\n")
    old = time.time() - 60 * 86_400  # 60 days ago
    os.utime(lock, (old, old))
    check = doctor.check_seal(tmp_path)
    assert check.status == "WARN"


def test_render_json_is_valid(healthy_project: Path):
    report = doctor.run(healthy_project)
    payload = json.loads(doctor.render_json(report))
    assert "score" in payload
    assert payload["badge_url"].startswith("https://img.shields.io/badge/agentnotary-")
    assert isinstance(payload["checks"], list)


def test_render_text_includes_score(healthy_project: Path):
    report = doctor.run(healthy_project)
    out = doctor.render_text(report, color=False)
    assert "AgentNotary Score" in out
    assert f"{report.score}/100" in out


def test_score_bounds(empty_project: Path, healthy_project: Path):
    assert 0 <= doctor.run(empty_project).score <= 100
    assert 0 <= doctor.run(healthy_project).score <= 100


def test_main_exit_codes(healthy_project: Path, monkeypatch, capsys):
    monkeypatch.chdir(healthy_project)
    rc = doctor.main(["--no-color"])
    assert rc == 0


def test_main_fail_exit(empty_project: Path, monkeypatch, capsys):
    monkeypatch.chdir(empty_project)
    rc = doctor.main(["--no-color"])
    assert rc == 1
