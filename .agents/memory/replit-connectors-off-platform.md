---
name: Replit connectors break off-platform deploys
description: Code using @replit/connectors-sdk (e.g. Resend, or other Replit integrations) only works inside the Replit environment; a deployed server elsewhere needs a fallback.
---

- The Replit connector proxy (`@replit/connectors-sdk`, `ReplitConnectors().proxy(...)`) authenticates via Replit's own session/environment context. It has no meaning outside Replit — a server deployed to Fly.io (or any non-Replit host) gets connection failures / 502s on any code path that calls it, even though the same code works fine in the Replit dev workflow.
- **Why:** integrations set up through Replit's connectors UI (e.g. "Resend" installed as a connector) are Replit-account-scoped; there is no portable credential embedded in the connector itself.
- **How to apply:** before deploying a service that uses a Replit connector to an external host, add a direct-API fallback gated on an explicit env var (e.g. `RESEND_API_KEY`): if the var is set, call the provider's REST API directly with it; otherwise keep using the connector (for Replit dev). Provision that secret on the external host's own secret store (e.g. `fly secrets set`) — it is separate from Replit's env secrets.
