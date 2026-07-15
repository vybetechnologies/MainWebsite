---
name: Fly.io DATABASE_URL vs NEON_DATABASE_URL
description: The Fly app needs DATABASE_URL set explicitly; it is not the same as NEON_DATABASE_URL automatically.
---

## The trap
`lib/db/src/index.ts` reads `process.env.DATABASE_URL`. The Fly secrets historically had `NEON_DATABASE_URL` (the actual Neon connection string) but NOT `DATABASE_URL`. The app crashes on boot with "DATABASE_URL must be set."

**Why:** Whoever set up the initial Fly secrets used `NEON_DATABASE_URL` as the name, but the db lib reads `DATABASE_URL`. The mismatch was invisible until a deploy was forced.

## Fix applied
`flyctl secrets set DATABASE_URL="$NEON_DATABASE_URL" --app vybe-api-server`

Both secrets now exist on Fly and point to the same Neon database.

## How to apply
When adding any new Fly app that uses `lib/db`, ensure `DATABASE_URL` is explicitly set as a Fly secret (copy the value from `NEON_DATABASE_URL`). Do not rely on a Fly env alias — set the actual secret.
