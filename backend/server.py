from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import subprocess
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MEDIA_DIR = ROOT_DIR / "media"
MEDIA_DIR.mkdir(exist_ok=True)

VOICEOVER_PATH = MEDIA_DIR / "voiceover.mp3"
WALKTHROUGH_VIDEO_PATH = MEDIA_DIR / "walkthrough.mp4"
HERO_PATH = MEDIA_DIR / "hero.png"
REPO_PATH = MEDIA_DIR / "repo.png"
TERMINAL_PATH = MEDIA_DIR / "terminal.png"

VOICEOVER_SCRIPT = (
    "Welcome to AgentNotary. In a world of autonomous agents, trust is the missing layer. "
    "With one command, agentnotary init, you can scaffold a secure governance manifest. "
    "Our seal command creates a cryptographic lock for your prompts and tools, ensuring zero drift. "
    "Before deployment, use agentnotary attack to probe for OWASP Top Ten vulnerabilities. "
    "It's the trust infrastructure every AI architect needs. "
    "Secure your agents today at CharanBharathula slash agentnotary."
)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ---------- Media generation ----------

async def generate_voiceover() -> None:
    """Generate TTS audio (one-time) using OpenAI TTS via emergentintegrations."""
    if VOICEOVER_PATH.exists() and VOICEOVER_PATH.stat().st_size > 1000:
        return
    from emergentintegrations.llm.openai import OpenAITextToSpeech
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not configured")
    tts = OpenAITextToSpeech(api_key=api_key)
    audio_bytes = await tts.generate_speech(
        text=VOICEOVER_SCRIPT,
        model="tts-1-hd",
        voice="onyx",
        response_format="mp3",
        speed=1.0,
    )
    VOICEOVER_PATH.write_bytes(audio_bytes)
    logger.info(f"Voiceover generated: {VOICEOVER_PATH} ({len(audio_bytes)} bytes)")


def _get_audio_duration(path: Path) -> float:
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            stderr=subprocess.STDOUT,
            timeout=10,
        )
        return float(out.decode().strip())
    except Exception as e:
        logger.warning(f"ffprobe failed: {e}; defaulting 40s")
        return 40.0


def generate_walkthrough_video() -> None:
    """Build a synced MP4 walkthrough from the screenshots + narrated audio."""
    if WALKTHROUGH_VIDEO_PATH.exists() and WALKTHROUGH_VIDEO_PATH.stat().st_size > 10000:
        return
    if not VOICEOVER_PATH.exists():
        raise RuntimeError("Voiceover missing; generate audio first")

    duration = _get_audio_duration(VOICEOVER_PATH)
    # 6 narrative beats aligned to script
    beats = [
        REPO_PATH,
        TERMINAL_PATH,
        TERMINAL_PATH,
        TERMINAL_PATH,
        HERO_PATH,
        REPO_PATH,
    ]
    per = duration / len(beats)

    # Render each beat as its own short video segment (reliable timing),
    # then concat via the concat protocol.
    segments = []
    try:
        for i, img in enumerate(beats):
            seg = MEDIA_DIR / f"_seg_{i}.mp4"
            cmd = [
                "ffmpeg", "-y",
                "-loop", "1", "-t", f"{per:.3f}", "-i", str(img),
                "-vf",
                "scale=1280:720:force_original_aspect_ratio=decrease,"
                "pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=black,"
                "format=yuv420p",
                "-r", "30",
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
                "-pix_fmt", "yuv420p",
                str(seg),
            ]
            subprocess.run(cmd, check=True, capture_output=True, timeout=180)
            segments.append(seg)

        concat_file = MEDIA_DIR / "_concat.txt"
        concat_file.write_text("\n".join(f"file '{s.as_posix()}'" for s in segments))

        silent = MEDIA_DIR / "_silent.mp4"
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file),
             "-c", "copy", str(silent)],
            check=True, capture_output=True, timeout=120,
        )

        subprocess.run(
            ["ffmpeg", "-y",
             "-i", str(silent),
             "-i", str(VOICEOVER_PATH),
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-shortest", "-movflags", "+faststart",
             str(WALKTHROUGH_VIDEO_PATH)],
            check=True, capture_output=True, timeout=120,
        )
    finally:
        for p in [*segments, MEDIA_DIR / "_concat.txt", MEDIA_DIR / "_silent.mp4"]:
            try:
                p.unlink()
            except Exception:
                pass
    logger.info(f"Walkthrough video built: {WALKTHROUGH_VIDEO_PATH}")


# ---------- Routes ----------

@api_router.get("/")
async def root():
    return {"service": "AgentNotary Site", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get('timestamp'), str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.get("/media/voiceover.mp3")
async def serve_voiceover():
    if not VOICEOVER_PATH.exists():
        try:
            await generate_voiceover()
        except Exception as e:
            logger.exception("voiceover generation failed")
            raise HTTPException(status_code=500, detail=f"voiceover generation failed: {e}")
    return FileResponse(
        VOICEOVER_PATH,
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=86400", "Accept-Ranges": "bytes"},
    )


@api_router.get("/media/walkthrough.mp4")
async def serve_walkthrough():
    if not WALKTHROUGH_VIDEO_PATH.exists():
        try:
            if not VOICEOVER_PATH.exists():
                await generate_voiceover()
            await asyncio.to_thread(generate_walkthrough_video)
        except Exception as e:
            logger.exception("walkthrough generation failed")
            raise HTTPException(status_code=500, detail=f"walkthrough generation failed: {e}")
    return FileResponse(
        WALKTHROUGH_VIDEO_PATH,
        media_type="video/mp4",
        headers={"Cache-Control": "public, max-age=86400", "Accept-Ranges": "bytes"},
    )


def _serve_image(path: Path):
    if not path.exists():
        raise HTTPException(status_code=404, detail="not found")
    return FileResponse(path, media_type="image/png",
                        headers={"Cache-Control": "public, max-age=86400"})


@api_router.get("/media/hero.png")
async def serve_hero():
    return _serve_image(HERO_PATH)


@api_router.get("/media/repo.png")
async def serve_repo():
    return _serve_image(REPO_PATH)


@api_router.get("/media/terminal.png")
async def serve_terminal():
    return _serve_image(TERMINAL_PATH)


@api_router.get("/media/status")
async def media_status():
    return {
        "voiceover": VOICEOVER_PATH.exists() and VOICEOVER_PATH.stat().st_size,
        "walkthrough": WALKTHROUGH_VIDEO_PATH.exists() and WALKTHROUGH_VIDEO_PATH.stat().st_size,
        "hero": HERO_PATH.exists(),
        "repo": REPO_PATH.exists(),
        "terminal": TERMINAL_PATH.exists(),
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
