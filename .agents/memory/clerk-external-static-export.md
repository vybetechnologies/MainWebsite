---
name: External Clerk on static-export Next.js + separate Fly API
description: How Clerk is wired for a Cloudflare Pages (static export) frontend + Fly.io API backend using the user's own external Clerk account.
---

## Architecture
- Frontend: Cloudflare Pages, Next.js `output: 'export'`, no server runtime.
- API: Fly.io Express server using `@clerk/express`.
- Auth flow: `@clerk/react` in the browser → JWT Bearer token → API validates with `@clerk/express` middleware.

## Publishable key delivery
Cloudflare Pages has no build-time secret injection wired up for this project. The Clerk **publishable key** (not secret — designed to be public) is committed directly to `src/lib/clerk-config.ts` as a string constant, same pattern as the Sanity project ID.
**Why:** `NEXT_PUBLIC_*` env var approach requires Cloudflare Pages env var configuration; the committed-constant approach is simpler and consistent with the existing codebase convention.
**How to apply:** When rotating Clerk publishable key, update `src/lib/clerk-config.ts` and redeploy.

## Secret key on Fly
`CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` must both be set as Fly secrets. `@clerk/express` uses the secret key to validate JWTs server-side.

## Staff pages (ssr:false required)
All pages under `/staff` use `next/dynamic(..., { ssr: false })` with a `'use client'` wrapper page, because `ClerkProvider` and all Clerk React components throw during Next.js static prerender. Layout returns children unwrapped when `clerkPubKey` is undefined (server pass), but child pages must also skip rendering via ssr:false.

## External vs Replit-managed Clerk
This project uses the **user's own external Clerk account**. Do NOT re-run `setupClerkWhitelabelAuth` or the Replit Auth pane — that would overwrite the external keys in Replit secrets with Replit-managed keys and break the staff login.
