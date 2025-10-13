# Polycalc (extended)
Updated: 2025-10-11

Environment quickstart:
- Copy `.env.example` to `.env.local`.
- Fill `PRIMARY_BASE_URL`, `PRIMARY_API_KEY`, and `PRIMARY_MODEL`.
- Optional: set `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` for analytics.
- Leave the keys blank to use the mock tutor during local dev.
- Production `functions/api/ask.js` reads the same env vars.
- Keep secrets out of version control — do not commit `.env.local`.
- Restart `pnpm dev` after changing env vars.
- See Usage below for sample configs.

Interactive, explorable math — scrub, see, ask.

## Run
```bash
pnpm i
pnpm dev
```
Open http://localhost:3000 and try **Formulas → Quadratic** or **Projectile**.

## Usage

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
See `docs/credits.md` — Inspired by Bret Victor’s Kill Math (not affiliated).
