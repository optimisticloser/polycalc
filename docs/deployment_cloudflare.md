# Cloudflare Pages Deployment
Updated: 2025-10-11

- Build: `pnpm build && pnpm export`
- Output dir: `out/`
- Keep `functions/` for `/api/ask`
- Env vars: `PRIMARY_BASE_URL`, `PRIMARY_API_KEY`, `PRIMARY_MODEL`
- Local dev: `wrangler pages dev .`
