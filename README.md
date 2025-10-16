# Polycalc
Updated: 2025-10-16

Interactive, explorable math — scrub, see, ask. This project explores “exploded” visualizations of formulas with interactive variables and an AI tutor that explains context.

## Project Status

- In progress, early stage. Many pieces are still being wired up and polished.
- Known rough edges:
  - Variable hovers are currently poor/buggy and need refinement.
  - AI assistant is partially working (mock locally; production path is WIP).
  - UI styling still needs significant polishing and cohesion.

## What Works Today

- Local dev server and core pages load on port 3000.
- Multiple interactive formula views are available (e.g., Quadratic, Projectile; others are being integrated).
- Exploded mode foundations: variables render as interactive tokens; popovers show metadata.
- Scenarios foundation: saving and restoring variable configurations (local persistence) exists and is being expanded.
- API route for AI tutor is wired (`functions/api/ask.js` and `app/api/ask/route.ts`) and reads env vars; local mock works when keys are omitted.

## What’s Rough/Incomplete

- Variable hover UX is not good yet (positioning, latency, overall feel need work).
- AI tutor integration is halfway:
  - Contextual analysis exists but needs better prompts and reliability.
  - Production model configuration and error handling need hardening.
- UI polish: spacing, typography, dark/light balance, and component consistency need a pass.

## Vision (Aspirational, WIP)

- Fully “exploded” formulas with per-variable insights and examples.
- Rich VarPopover with contextual AI explanations and smart tips tied to current values.
- Scenario Manager to create, save, compare, and share multi-variable setups per formula.
- Performance-friendly, on-demand AI insights and smooth interactions.

See `docs/exploded-mode-features.md` for the advanced exploded-mode feature set being implemented and extended across formulas like Quadratic, Predator-Prey (Lotka–Volterra), Sine wave, and Euler’s formula.

## Getting Started

Environment quickstart:
- Copy `.env.example` to `.env.local`.
- Fill `PRIMARY_BASE_URL`, `PRIMARY_API_KEY`, and `PRIMARY_MODEL`.
- Optional: set `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` for analytics.
- Leave the keys blank to use the mock tutor during local dev.
- Production `functions/api/ask.js` reads the same env vars.
- Keep secrets out of version control — do not commit `.env.local`.
- Restart `pnpm dev` after changing env vars.

## Run
```bash
pnpm i
pnpm dev
```
Open http://localhost:3000 and try Formulas → Quadratic or Projectile.

## Environment Examples

Do not commit `.env.local`.

### OpenAI `.env.local`

```bash
PRIMARY_BASE_URL=https://api.openai.com/v1
PRIMARY_API_KEY=sk-your-openai-key
PRIMARY_MODEL=gpt-4o-mini
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=
```

### Local GLM gateway `.env.local`

```bash
PRIMARY_BASE_URL=http://localhost:8000/v1
PRIMARY_API_KEY=local-dev-token
PRIMARY_MODEL=glm-4
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=
```

## Roadmap (Non-exhaustive)

- Improve hover interactions (placement, responsiveness, and readability).
- Harden AI integration (prompting, streaming, error handling, and model config).
- Polish UI: unify spacing/typography, refine components, and improve dark/light modes.
- Expand exploded mode coverage and metadata across all core formulas.
- Add scenario comparison views and curated presets per formula.

## Export & Deploy (Cloudflare Pages)
- Build & export: `pnpm build && pnpm export`
- Output dir: `out/`
- Keep `functions/` in the repo for `/api/ask`
- Set env vars in Pages → Settings → Variables:
  - `PRIMARY_BASE_URL`
  - `PRIMARY_API_KEY`
  - `PRIMARY_MODEL`
- Optional local: `wrangler pages dev .`

## Attribution
Inspired by Bret Victor’s “Kill Math,” the Scrubbing Calculator, and Explorable Explanations. See `docs/credits.md`. This is a tribute project; not affiliated.
