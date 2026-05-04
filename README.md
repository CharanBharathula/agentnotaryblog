# agentnotaryblog

Source for **[charanbharathula.github.io/agentnotaryblog](https://charanbharathula.github.io/agentnotaryblog)** — the launch article for [AgentNotary](https://github.com/CharanBharathula/agentnotary), an open-source CLI for sealing, governing, and auditing AI agents.

The site is a single-page React app (Create React App + craco + Tailwind), deployed to GitHub Pages on every push to `main` or `claude/blog-single-page-app-akedK`.

```
charanbharathula.github.io/agentnotaryblog
└── frontend/                       # React app (CRA + craco + Tailwind + framer-motion + lenis)
    ├── public/media/               # hero.png, repo.png, terminal.png, voiceover.mp3, walkthrough.mp4
    └── src/components/site/
        ├── Nav.jsx                 # top nav + reading-progress bar
        ├── ArticleHeader.jsx       # hero + cover image + stats strip
        ├── BlogPage.jsx            # full article body (problem → install → commands → roadmap)
        ├── Commands.jsx            # interactive terminal showcasing all 8 CLI commands
        ├── Walkthrough.jsx         # screenshot carousel + walkthrough video
        ├── Comparison.jsx          # AgentNotary vs LangSmith / Langfuse / Helicone / AgentOps
        ├── AudioPlayer.jsx         # AI-narrated voice-over
        └── Footer.jsx
```

## Local development

```bash
cd frontend
yarn install
yarn start                  # http://localhost:3000
```

The dev server proxies `/api/media/*` to a local FastAPI backend by default,
but the production build embeds all media under `public/media/` and uses the
`mediaUrl()` helper at `frontend/src/lib/mediaUrl.js` so the site is fully
static. No backend needs to run for the deployed version.

## Production build

```bash
cd frontend
yarn build                  # outputs to frontend/build/
```

CRA's `homepage` field in `frontend/package.json` is set to
`https://charanbharathula.github.io/agentnotaryblog`, which makes `PUBLIC_URL`
correct for the `/agentnotaryblog/` sub-path on GitHub Pages.

## Deployment

`.github/workflows/deploy.yml` builds the React app on every push to `main` or
`claude/blog-single-page-app-akedK`, then publishes `frontend/build/` to the
`gh-pages` branch via `JamesIves/github-pages-deploy-action@v4`. GitHub Pages
serves from `gh-pages` / `(root)`.

`frontend/public/404.html` redirects deep links back to `index.html` so SPA
routes work under the GitHub Pages sub-path.

## What the article covers

The blog is the v0.3.0 release post for AgentNotary. It walks through:

1. **The gap in today's stack** — observability tools watch agents, none of them certify or enforce. Includes the documented `$47K / 11-day` runaway-agent incident.
2. **Install & configure** — `pip install agentnotary[...]`, the `agentnotary.yaml` manifest schema with a real refund-bot example.
3. **The eight commands** — `seal`, `guard run`, `attack`, `compliance`, `bom`, `bench`, `replay`, `init` — each with a real terminal block and configuration notes.
4. **What's coming next (v0.3.1)** — `doctor` (one-shot health scan + 0–100 score), `drift` (provider-side weight-update detection), `compare` (lockfile diff), the `agentnotary-action` GitHub Action, and the AgentNotary Score badge.
5. **Long-term roadmap** — Sigstore-style transparency log (v0.4), AgentNotary Hub (v0.5).
6. **How it fits alongside your stack** — runs side by side with LangSmith, Langfuse, Helicone, AgentOps. None of them seal, enforce, or scaffold compliance docs.

## Bundled CLI features (preview)

The `agentnotary-features/` directory at the repo root is a **standalone
reference implementation** of the new v0.3.1 commands described in the article
plus a GitHub Action and 27 passing unit tests. The code is ready to be copied
into the [agentnotary CLI repo](https://github.com/CharanBharathula/agentnotary).
See `agentnotary-features/README.md` for integration steps.

```
agentnotary-features/
├── agentnotary/commands/
│   ├── doctor.py    # `agentnotary doctor` — health scan + 0-100 score + Shields.io badge
│   ├── drift.py     # `agentnotary drift`  — re-runs probes, detects provider-side weight drift
│   └── compare.py   # `agentnotary compare`— diffs two agent.lock files
├── action/
│   └── action.yml   # GitHub Action: validate → seal --verify → attack → compliance → doctor
└── tests/           # pytest suite — runs in <1s
```

Run the tests:

```bash
cd agentnotary-features
pip install pytest pyyaml
pytest tests/ -q            # 27 passed in 0.23s
```

## License

Apache 2.0 — same as the AgentNotary CLI.

## Links

- AgentNotary CLI: <https://github.com/CharanBharathula/agentnotary>
- Live blog: <https://charanbharathula.github.io/agentnotaryblog>
- PyPI: `pip install agentnotary`
