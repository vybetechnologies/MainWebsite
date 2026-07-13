---
name: esbuild externals need node_modules in Docker runtime
description: build.mjs externalizes some npm packages from the esbuild bundle; a Docker runtime stage that only copies dist/ will crash on those imports.
---

- The api-server's `build.mjs` esbuild config keeps a long `external` list (packages that can't be safely bundled — native modules, path-traversal loaders like `@google-cloud/*`, etc). Anything on that list is `import`ed at runtime exactly as written, not inlined into `dist/index.mjs`.
- A Docker runtime stage that only does `COPY --from=build /repo/artifacts/api-server/dist ./dist` will boot and pass a health check, but crash with `ERR_MODULE_NOT_FOUND` the first time a route actually exercises an externalized import (e.g. object-storage upload code using `@google-cloud/storage`).
- **Why:** pnpm hoists deps into a root `node_modules/.pnpm` content store with workspace packages symlinking into it; the dist bundle's bare-specifier imports need that structure present at the same relative paths to resolve.
- **How to apply:** in the runtime stage, preserve the pnpm layout — `COPY --from=build /repo/node_modules ./node_modules` and `COPY --from=build /repo/artifacts/api-server/node_modules ./artifacts/api-server/node_modules` alongside the `dist` copy, keeping `/repo/...` as the working directory structure (not flattening to `/app`). Check `grep -oE 'from "[^\"]+"' dist/index.mjs` for the actual externalized imports in use before assuming which ones matter.
