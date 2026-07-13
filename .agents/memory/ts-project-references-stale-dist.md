---
name: TS project references need rebuild after new lib exports
description: Why a newly-added export from a composite workspace lib isn't visible to dependents until rebuilt
---

In this monorepo, workspace libs like `lib/db` use TypeScript project references with `composite: true` + `emitDeclarationOnly: true`. Dependents (e.g. `artifacts/api-server`) type-check against that lib's `dist/*.d.ts`, not its `src` directly — even though the package's `exports` field in `package.json` points at `./src/index.ts` for bundling/runtime.

Symptom: you add a new export (e.g. a new Drizzle table) to a lib's `src/schema/index.ts`, but a dependent package's `tsc --noEmit` reports "has no exported member ..." even though the source clearly exports it.

**Why:** the referenced project's declaration output is stale — it was generated before your new export existed, and per-project `tsc -p ... --noEmit` does not know to rebuild its project references.

**How to apply:** after adding/changing exports in a `lib/*` package, run the root `pnpm run typecheck:libs` (`tsc --build`) to regenerate declaration outputs before typechecking dependents; deleting stray `.tsbuildinfo` files does not substitute for this.
