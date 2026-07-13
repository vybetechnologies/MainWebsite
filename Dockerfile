# Multi-stage build for @workspace/api-server (Fly.io deployment).
# Build context must be the monorepo root.

FROM node:22-slim AS build
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server run build

FROM node:22-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production

# esbuild externalizes a few packages that can't be safely bundled (see build.mjs).
# Preserve the pnpm node_modules layout (root store + workspace symlinks) so those
# externalized imports (e.g. @google-cloud/storage) still resolve at runtime.
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/artifacts/api-server/node_modules ./artifacts/api-server/node_modules
COPY --from=build /repo/artifacts/api-server/dist ./artifacts/api-server/dist

EXPOSE 8080
CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
