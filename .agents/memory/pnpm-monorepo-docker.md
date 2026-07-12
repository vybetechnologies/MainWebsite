---
name: pnpm monorepo Docker builds
description: How to Dockerize a single service (e.g. an Express API) out of a pnpm workspace monorepo where internal libs are consumed as raw source, not pre-built.
---

If internal workspace packages (e.g. `@workspace/db`) declare their `exports` field pointing directly at `./src/index.ts` (no build step, no `dist`), then whichever service bundles with esbuild (or similar) pulls that TS source directly into its own bundle at build time. This means:

- A single-stage-build Dockerfile is enough: copy the full monorepo context, `pnpm install --frozen-lockfile`, then just build the one target service (`pnpm --filter <service> run build`). No need to build each internal lib package separately first.
- The runtime image only needs the target service's `dist/` output copied out of the build stage — no `node_modules` needed at runtime if the bundler inlines all deps (check the bundler's external-packages list for exceptions like native modules).
- Build context must be the repo root (not the service subdirectory), since the Dockerfile needs access to `pnpm-workspace.yaml`, the root lockfile, and all workspace package.json files for `pnpm install` to resolve correctly.
