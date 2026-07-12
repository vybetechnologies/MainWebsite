# VYBE Technologies Website

Corporate website for **VYBE Technologies Inc.** — mobile IT support, cybersecurity, AI training, and managed tech services for individuals, seniors, and small businesses in Fargo, North Dakota.

## Stack

- **React 19** + **Vite 7** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Wouter** for client-side routing
- **pnpm workspaces** monorepo

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm --filter @workspace/vybe-website run dev
```

The site will be available at `http://localhost:5173`.

## Build

```bash
pnpm --filter @workspace/vybe-website run build
```

Built files are output to `artifacts/vybe-website/dist/public/`.

## Cloudflare Pages Deployment

### Option 1 — Wrangler CLI (recommended for manual deploys)

1. Install dependencies and build:
   ```bash
   pnpm install
   pnpm --filter @workspace/vybe-website run build
   ```

2. Log in to Cloudflare:
   ```bash
   pnpm wrangler login
   ```

3. Deploy:
   ```bash
   pnpm wrangler pages deploy artifacts/vybe-website/dist/public --project-name vybe-website
   ```

### Option 2 — Cloudflare Pages Git Integration (recommended for CI/CD)

1. Push this repository to GitHub (or GitLab).
2. In the [Cloudflare Pages dashboard](https://dash.cloudflare.com/?to=/:account/pages), create a new project and connect your repo.
3. Set the following build settings:

   | Setting | Value |
   |---|---|
   | **Framework preset** | None |
   | **Build command** | `pnpm run build` |
   | **Build output directory** | `artifacts/vybe-website/dist/public` |
   | **Deploy command** | `cd artifacts/vybe-website && npx wrangler pages deploy` |
   | **Root directory** | *(leave blank — use repo root)* |

   > **Important:** Use `npx wrangler pages deploy` (not `wrangler deploy` — that is for Workers). The `cd artifacts/vybe-website` prefix is required so wrangler finds the `wrangler.toml` inside the artifact directory rather than running from the monorepo root.
5. Click **Save and Deploy**.

> Cloudflare Pages automatically handles SPA routing via the `_redirects` file and applies security/cache headers from the `_headers` file.

### Custom Domain

After deploying, assign your domain (`vybetechnologies.net`) in the Cloudflare Pages dashboard under **Custom domains**.

## Production Infrastructure

This project runs entirely on non-Replit infrastructure in production. Replit is used only as the development environment.

| Layer | Provider | Notes |
|---|---|---|
| Frontend (`artifacts/vybe-website`) | **Cloudflare Pages** | Deployed via Git integration (see above). Live at `vybetechnologies.net`. |
| API (`artifacts/api-server`) | **Fly.io** | App name `vybe-api-server`, deployed via `Dockerfile` + `fly.toml` at the repo root. Live at `https://vybe-api-server.fly.dev`. |
| Database (`lib/db`) | **Neon.tech** | Serverless Postgres. Connection string stored as the `DATABASE_URL` secret on Fly, and as `NEON_DATABASE_URL` for local/dev use. |
| Source control | **GitHub** | `vybetechnologies/MainWebsite`, branch `main`. |
| CI/CD | **GitHub Actions** | `.github/workflows/fly-deploy.yml` redeploys the API server to Fly on every push to `main` that touches `artifacts/api-server`, `lib/`, `Dockerfile`, or `fly.toml`. Requires a `FLY_API_TOKEN` secret configured in the GitHub repo's Actions secrets. |

### Deploying the API server manually

```bash
# from the repo root
fly deploy --config fly.toml --remote-only
```

Requires `flyctl` installed and authenticated (`fly auth login`, or `FLY_API_TOKEN` in the environment), and a `DATABASE_URL` secret already set on the Fly app:

```bash
fly secrets set DATABASE_URL="<your Neon connection string>" --app vybe-api-server
```

## Project Structure

```
artifacts/vybe-website/
├── public/
│   ├── _redirects       # SPA fallback for Cloudflare Pages
│   ├── _headers         # Security + cache headers
│   ├── hero-bg.jpg
│   └── cyber-bg.jpg
├── src/
│   ├── pages/           # One file per route
│   ├── components/      # Navbar, Footer, Layout, SEO
│   └── index.css        # Tailwind + CSS variables (dark theme)
└── dist/public/         # Build output (git-ignored)
```

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About VYBE Technologies |
| `/services` | Services overview |
| `/services/business-tech-management` | Business Technology Management |
| `/services/tech-rescue` | VYBE Tech Rescue |
| `/services/home-tech-care` | VYBE Home Tech Care |
| `/services/cybersecurity` | Cybersecurity & Scam Protection |
| `/services/ai-setup` | AI Setup & Training |
| `/pricing` | Pricing |
| `/contact` | Contact / Book Service |
