# Multi-stage build for @workspace/api-server (Fly.io deployment).
# Build context must be the monorepo root.

FROM node:22-slim AS build
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /repo/artifacts/api-server/dist ./dist

EXPOSE 8080
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
