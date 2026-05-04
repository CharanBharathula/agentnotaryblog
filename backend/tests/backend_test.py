"""Backend tests for AgentNotary site."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://agent-notary.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    return s


# -------- /api/ root --------
def test_root_ok(session):
    r = session.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "service" in data


# -------- /api/media/status --------
def test_media_status(session):
    r = session.get(f"{BASE_URL}/api/media/status", timeout=15)
    assert r.status_code == 200
    data = r.json()
    for key in ("voiceover", "walkthrough", "hero", "repo", "terminal"):
        assert key in data, f"missing key {key} in /api/media/status: {data}"
    # voiceover and walkthrough are returned as the file size (truthy int) when present
    assert data["voiceover"] and int(data["voiceover"]) > 1000
    assert data["walkthrough"] and int(data["walkthrough"]) > 10000
    assert data["hero"] is True
    assert data["repo"] is True
    assert data["terminal"] is True


# -------- /api/media/voiceover.mp3 --------
def test_voiceover_mp3(session):
    r = session.get(f"{BASE_URL}/api/media/voiceover.mp3", timeout=60)
    assert r.status_code == 200
    ct = r.headers.get("content-type", "")
    assert "audio/mpeg" in ct, f"unexpected content-type: {ct}"
    assert len(r.content) > 10_000, f"audio body too small: {len(r.content)} bytes"


# -------- /api/media/walkthrough.mp4 --------
def test_walkthrough_mp4(session):
    r = session.get(f"{BASE_URL}/api/media/walkthrough.mp4", timeout=120)
    assert r.status_code == 200
    ct = r.headers.get("content-type", "")
    assert "video/mp4" in ct, f"unexpected content-type: {ct}"
    assert len(r.content) > 100_000, f"video body too small: {len(r.content)} bytes"
    # MP4 magic: ftyp box at offset 4
    assert r.content[4:8] == b"ftyp", "not a valid MP4 (missing ftyp box)"


# -------- /api/media/{hero,repo,terminal}.png --------
@pytest.mark.parametrize("name", ["hero", "repo", "terminal"])
def test_image_endpoints(session, name):
    r = session.get(f"{BASE_URL}/api/media/{name}.png", timeout=30)
    assert r.status_code == 200, f"{name}.png returned {r.status_code}"
    ct = r.headers.get("content-type", "")
    assert "image/png" in ct, f"{name}.png unexpected content-type: {ct}"
    assert len(r.content) > 1024, f"{name}.png too small: {len(r.content)} bytes"
    # PNG magic
    assert r.content[:8] == b"\x89PNG\r\n\x1a\n", f"{name}.png invalid PNG magic"
