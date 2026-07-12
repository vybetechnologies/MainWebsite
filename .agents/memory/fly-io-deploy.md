---
name: Fly.io deploy gotchas
description: Non-obvious requirements when deploying a Node/Express app to Fly.io from a pnpm monorepo, including GitHub Actions CI secret setup.
---

- `fly apps create` fails with "We need your payment information to continue" until the account has a card on file, even for free-tier/low-usage apps. This is an account-level blocker only the account owner can resolve (Fly dashboard billing page) — cannot be worked around from the CLI.
- Fly does **not** automatically set a `PORT` env var in the container, unlike some other PaaS providers. If the app code does `process.env.PORT` (throwing if unset), you must explicitly set `PORT` in `fly.toml`'s `[env]` block to match `[http_service].internal_port`, or the app crashes on boot (exit_code=1) and Fly reports "app is not listening on the expected address."
- `fly logs` streams and does not exit on its own — always wrap it in `timeout Ns` when running non-interactively, or it hangs.
- `fly secrets set KEY="$ENV_VAR"` works fine for pushing a Replit secret's value into Fly without ever printing it, as long as the shell command doesn't echo the variable.
- A GitHub Actions `fly-deploy.yml` workflow needs `FLY_API_TOKEN` set as a **repo Actions secret** (repo Settings > Secrets and variables > Actions), which is entirely separate from a same-named Replit environment secret. If the workflow fails with `Error: no access token available. Please login with 'flyctl auth login'`, the repo secret is missing or empty.
  - **Why:** Replit env secrets are never synced to GitHub; they're different secret stores even when the key name matches.
  - **How to apply:** Set it via GitHub's REST API — `GET .../actions/secrets/public-key` then `PUT .../actions/secrets/{name}` with `encrypted_value` produced by libsodium's `crypto_box_seal` against the repo's public key. Node's built-in `crypto` module cannot do NaCl sealed-box encryption, so install `libsodium-wrappers` in a scratch directory (e.g. `/tmp/...`) for one-off use rather than adding it to the repo.
