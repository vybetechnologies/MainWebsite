# VYBE Technologies

Corporate website, API server, and supporting tools for VYBE Technologies (digital products, business solutions, and human-centered tech services).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/vybe-website` — Next.js 15 (App Router, static export) marketing site.
- `artifacts/api-server` — Express API backend.
- `artifacts/mockup-sandbox` — component preview sandbox.
- `studio/` — standalone Sanity Studio (headless CMS) for the Newsroom, deployed to https://vybe-newsroom.sanity.studio/. Not a Replit artifact (no workflow/preview) — see `studio/README.md` for the editorial workflow.
- `artifacts/vybe-website/src/lib/sanity/` — Sanity read client (`client.ts`, server-only), image URL builder (`image.ts`, safe for client components), GROQ queries, and types for Newsroom content.

## Architecture decisions

- Newsroom content lives in Sanity (project `fupqvdcv`, dataset `production`, public-read). The website statically exports (`output: 'export'`), so all Sanity fetches happen at `next build` time only — publishing a new article requires a site rebuild/redeploy, there is no runtime revalidation.
- Sanity's data client (`@sanity/client`) must only be imported from server components/modules (`src/lib/sanity/client.ts`). The image URL builder (`src/lib/sanity/image.ts`) is separated out because it's safe to bundle into client components and only needs the public `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` env vars.

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
