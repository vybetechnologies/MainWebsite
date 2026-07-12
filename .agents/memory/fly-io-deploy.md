---
name: Fly.io deploy gotchas
description: Non-obvious requirements when deploying a Node/Express app to Fly.io from a pnpm monorepo.
---

- `fly apps create` fails with "We need your payment information to continue" until the account has a card on file, even for free-tier/low-usage apps. This is an account-level blocker only the account owner can resolve (Fly dashboard billing page) — cannot be worked around from the CLI.
- Fly does **not** automatically set a `PORT` env var in the container, unlike some other PaaS providers. If the app code does `process.env.PORT` (throwing if unset), you must explicitly set `PORT` in `fly.toml`'s `[env]` block to match `[http_service].internal_port`, or the app crashes on boot (exit_code=1) and Fly reports "app is not listening on the expected address."
- `fly logs` streams and does not exit on its own — always wrap it in `timeout Ns` when running non-interactively, or it hangs.
- `fly secrets set KEY="$ENV_VAR"` works fine for pushing a Replit secret's value into Fly without ever printing it, as long as the shell command doesn't echo the variable.
