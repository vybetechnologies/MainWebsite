---
name: Square integration patterns
description: How Square is wired into the VYBE api-server and vybe-website; pitfalls encountered during setup.
---

## Architecture

- **Credentials**: `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_APPLICATION_ID` stored as Replit secrets.
- **Public config endpoint**: `GET /api/config/public` returns `squareApplicationId` + `squareLocationId` so the frontend can init Square Web Payments SDK without baking secrets into the Next.js static export.
- **Server client**: `lib/square-client.ts` — always call `getSquareClient()` fresh (never cache); amounts are `BigInt` in Square SDK v45, use `moneyToNumber()` helper before JSON responses.
- **Frontend SDK**: loaded dynamically from `https://web.squarecdn.com/v1/square.js`; `card.attach()` takes a CSS selector string (`'#square-card-container'`), NOT a DOM element.

## Build pitfalls

- `zod` must be explicitly installed in `api-server` (`pnpm --filter @workspace/api-server add zod`) — it's not hoisted enough for esbuild to find it just from the monorepo root.
- `square` and `zod` must NOT be in `build.mjs` externals — they're pure JS and bundle fine with esbuild. Adding them to externals causes `ERR_MODULE_NOT_FOUND` at runtime because the dist folder doesn't have its own node_modules.

**Why:** esbuild externals leave imports unresolved in the bundle; Node then tries to resolve them relative to `dist/index.mjs`, which has no `node_modules` sibling. Only use externals for packages that genuinely can't bundle (native .node bindings, dynamic require path traversal, etc.).

## Invoice flow (Square API)

Three-step: `customersApi.createCustomer` → `ordersApi.createOrder` (with line items + customerId) → `invoicesApi.createInvoice` (referencing orderId) → `invoicesApi.publishInvoice`. All require an `idempotencyKey: crypto.randomUUID()`.
