# AgentNotary — Landing Page & Blog

## Original Problem Statement
Build a professional, high-performance landing page and blog for the open-source project **AgentNotary** (https://github.com/CharanBharathula/agentnotary). Target: senior engineers, AI architects, compliance officers. Dark-mode cyber-professional theme (Vercel/Anthropic aesthetic), clean sans-serif (Geist). Sections: Hero with title "AgentNotary: The Trust Infrastructure for AI Agents" + hero illustration + GitHub CTAs; The Problem (Wild West of autonomous agents); The Solution (4 feature blocks); deep-dive blog; Walkthrough carousel with repo+terminal screenshots + voice-over audio player + synced walkthrough video.

## User Choices (Verbatim)
1. CTA URL: `https://github.com/CharanBharathula/agentnotary` (no social links).
2. Blog specifically about the AgentNotary repo.
3. Generate AI voice-over audio and synced video walkthrough from provided screenshots + script.
4. Host at a free domain like `agentnotary.emergent.sh` (handled via support_agent guidance — see below).
5. Blog must include the video, terminal screenshots, and deep-dive content.

## Stack
- Frontend: React 19 (CRA + craco), Tailwind, shadcn/ui, framer-motion, lenis smooth-scroll, embla-carousel-react, Geist Sans + Geist Mono (@fontsource).
- Backend: FastAPI + Motor/MongoDB. OpenAI TTS (`tts-1-hd`, voice `onyx`) via `emergentintegrations` using `EMERGENT_LLM_KEY`. FFmpeg-generated MP4 walkthrough.
- Persistence: Cached media at `/app/backend/media/` (auto-regenerated on cold start if missing).

## Architecture / What's Implemented (2026-05-04)
### Backend (`/app/backend/server.py`)
- `GET  /api/` health
- `GET  /api/status`, `POST /api/status` (existing Mongo demo)
- `GET  /api/media/voiceover.mp3` — OpenAI TTS, cached
- `GET  /api/media/walkthrough.mp4` — FFmpeg concat of hero+terminal+repo images timed to voiceover (29s @ 1280×720, 30fps, H.264 + AAC)
- `GET  /api/media/{hero,repo,terminal}.png` — static image assets
- `GET  /api/media/status` — presence + sizes of cached media

### Frontend (`/app/frontend/src/`)
- `App.js` — mounts Lenis smooth scroll + renders 9 sections
- `components/site/Nav.jsx` — sticky blurred nav with 6 anchor links + GitHub button
- `components/site/Hero.jsx` — headline + dual CTAs (Star on GitHub, Watch demo) + pip copy button + illustration + stats strip
- `components/site/Problem.jsx` — 2×2 "Wild West" cards with amber accents
- `components/site/Features.jsx` — 6-card bento grid (seal, compliance, attack, guard, bom, replay)
- `components/site/Commands.jsx` — tabs × 8 commands × interactive terminal
- `components/site/Walkthrough.jsx` — synced `<video>` + Embla carousel + `AudioPlayer`
- `components/site/AudioPlayer.jsx` — custom waveform + scrubber, play/pause, formatted time
- `components/site/Comparison.jsx` — 12-row × 5-column matrix vs LangSmith/Langfuse/Helicone/AgentOps
- `components/site/BlogPost.jsx` — long-form deep dive, embedded synced walkthrough video, terminal screenshot, terminal code blocks, CTAs
- `components/site/Footer.jsx` — brand + section nav + resources

## Testing (iteration 1)
- Backend: 7/7 endpoints pass (pytest)
- Frontend: 16/17 — one clipboard unhandled-rejection in restricted contexts → **FIXED** (try/catch + `document.execCommand` fallback in Hero.jsx and Commands.jsx)

## Deployment (Custom Domain)
Per platform guidance (support_agent):
- Click **Deploy → Deploy Now** in the Emergent UI → app goes live on a default Emergent production URL in ~10–15 min (50 credits/month).
- `*.emergent.sh` subdomains are not auto-provisioned. To use `agentnotary.emergent.sh` the user must own `emergent.sh` (or they can link any domain they own via **Link domain → Entri** after deploy).
- Persistent-disk note: media auto-regenerates on cold start if `/app/backend/media/*.mp3` or `.mp4` is missing (idempotent generators already in place).

## Backlog (P0/P1/P2)
- **P2** — streaming/range support for `/api/media/walkthrough.mp4` (already sends `Accept-Ranges: bytes`; FastAPI `FileResponse` handles byte ranges natively).
- **P2** — offer a "download the PDF brief" email-gated CTA (newsletter/early-access capture) backed by Mongo.
- **P2** — add blog RSS feed + OG/Twitter meta tags for social shareability.
- **P2** — per-section scroll-linked animations (parallax hero illustration).

## Next Actions
- Deploy on Emergent to get the live production URL.
- Optionally link a user-owned domain via Link domain → Entri.
