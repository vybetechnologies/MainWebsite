---
name: Cloudflare Pages build environment
description: What env vars, build command, and patterns are needed for the vybe-website Cloudflare Pages build to succeed.
---

## Build command
Must be `pnpm run pages:build` (not `pnpm run build`). The root `build` script runs all workspace packages including `studio` (Sanity Studio), which needs SANITY env vars and fails without them. `pages:build` is scoped to vybe-website only.
**Why:** studio was added to the workspace after the Cloudflare project was set up; nobody noticed until a deploy was attempted.
**How to apply:** Set via Cloudflare API PATCH to `/accounts/{id}/pages/projects/vybe-website` `build_config.build_command`. Already done.

## Required env vars (set on Cloudflare Pages production config)
- `SANITY_PROJECT_ID=fupqvdcv`
- `SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_PROJECT_ID=fupqvdcv`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_TELEMETRY_DISABLED=1`

These are non-secret public project IDs. Set via Cloudflare API PATCH. Without them the newsroom `generateStaticParams()` returns `[]`, triggering a Next.js 15 error (see below).

## Next.js 15 + output:'export' + generateStaticParams returning []
Next.js 15 throws "Page is missing generateStaticParams()" when the function returns an empty array for a dynamic route. Fix: add `export const dynamicParams = false` to the route file alongside `generateStaticParams`. This signals that zero static pages for this route is valid.
**Why:** Next.js 14 accepted empty arrays silently; v15 treats it as a configuration error.
**How to apply:** Always pair `dynamicParams = false` with any `generateStaticParams` that may legitimately return `[]`.

## React Query hooks in static export pages
Pages that use React Query hooks (useMutation, useQuery) must load their content via `next/dynamic(..., { ssr: false })` inside a `'use client'` wrapper. Otherwise Next.js prerender crashes with "No QueryClient set".
**Why:** Static export still server-prerenders client components; React Query v5 throws immediately when no provider is found.
**Pattern:** Create `*-dynamic.tsx` wrapper files that are `'use client'` and use dynamic ssr:false import. Affected pages: contact, tech-rescue, careers, staff pages.
