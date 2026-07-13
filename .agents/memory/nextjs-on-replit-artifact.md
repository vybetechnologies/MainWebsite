---
name: Next.js migration on a Replit "web" artifact
description: How to run a Next.js app inside a Replit artifact when no native nextjs artifact kind exists, and keep an existing Cloudflare Pages static-export deploy working.
---

There is no native `nextjs` artifact kind in Replit's `createArtifact` system. Reuse an
existing `kind="web"` artifact unchanged (don't touch `artifact.toml`'s kind, ports, or
paths) — its build/serve/publicDir and dev run-command fields are just shell commands,
so they work for any framework.

**Why:** avoids re-registering the artifact or touching Cloudflare Pages dashboard
settings / `wrangler.toml`, which point at a fixed `dist/public` output dir.

**How to apply:**
- Dev server: `next dev -H 0.0.0.0 -p ${PORT:-<fallback>}` mirrors the Vite convention used elsewhere in this workspace.
- Static export: set `output: 'export'` in `next.config.mjs`, then have the package's `build` script do `next build && cp -r out dist/public` so the existing Cloudflare Pages / wrangler.toml config (which expects `dist/public`) needs no changes.
- Add `allowedDevOrigins: ['*']` in `next.config.mjs` — Replit's preview proxy serves the app from a domain that differs from localhost, and Next's dev server otherwise blocks cross-origin requests (the Next.js analogue of Vite's `server.allowedHosts`).
- If the repo previously used a `src/pages/*` directory with a different router (e.g. wouter), rename it (e.g. to `src/legacy-content/`) and exclude it from `tsconfig.json` — Next's App Router treats any `pages/` (or `src/pages/`) dir as a magic auto-routed Pages Router directory, which silently creates conflicting routes.
- Tailwind v4: swap the Vite plugin (`@tailwindcss/vite`) for `@tailwindcss/postcss` + a `postcss.config.mjs`; the `@theme`/CSS-variable setup in the stylesheet itself doesn't need to change.
- All shadcn/ui primitives and any component using hooks/state need a `'use client'` directive for the App Router — do this as one bulk pass over `components/ui/*`.
