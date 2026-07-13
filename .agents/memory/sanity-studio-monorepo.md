---
name: Sanity Studio in a pnpm monorepo
description: How to add a Sanity Studio package without conflicting with the rest of the monorepo's dependency pins or the package firewall.
---

- No Replit connector exists for Sanity as of this writing. Provisioning (project + dataset creation) goes through the plain Sanity Management HTTP API using a user-provided `SANITY_API_TOKEN`.
- Run Studio as its own standalone workspace package (e.g. `studio/`), deployed to Sanity's free hosted Studio (`npx sanity deploy`), rather than embedding it inside a Next.js (or other) app that does static export. Static export and Sanity's SPA-style Studio routing don't mix cleanly, and Sanity's own docs recommend the standalone hosted Studio anyway.
- `sanity@3.x`'s bundled `@sanity/cli` pulls in `decompress@4.2.1`, which gets blocked by the package firewall (no safe newer version exists on that major). Fix: upgrade to `sanity@^6` / `@sanity/vision@^6`, whose `@sanity/cli@^7` no longer depends on `decompress`.
- Sanity Studio v6 requires React ^19.2.x. If the repo has a root-wide `pnpm.overrides` pinning React to an older version for other reasons (e.g. Expo compatibility), don't change the root pin — add *scoped* overrides instead, keyed to the studio package and its transitive deps (e.g. `"@workspace/studio>react": "19.2.2"`, `"sanity>react": "19.2.2"`, etc.). This lets only the studio subtree use the newer React while the rest of the monorepo is untouched. Leftover peer-dependency warnings from studio's own sub-deps after this are cosmetic, not blocking.
- Deploy non-interactively with `SANITY_AUTH_TOKEN=<token> npx sanity deploy --url <subdomain> -y` from inside the studio package; save the returned `appId` into `sanity.cli.ts`'s `deployment.appId` to skip future prompts.
