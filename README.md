# Polycalc (extended)
Updated: 2025-10-11

Interactive, explorable math — scrub, see, ask.

## Run
```bash
pnpm i
pnpm dev
```
Open http://localhost:3000 and try **Formulas → Quadratic** or **Projectile**.

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
