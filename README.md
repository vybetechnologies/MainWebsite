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
   | **Build command** | `pnpm run pages:build` |
   | **Build output directory** | `artifacts/vybe-website/dist/public` |
   | **Root directory** | *(leave blank — use repo root)* |

   > **Why `pages:build` instead of the plain build command?**
   > This monorepo contains Replit-specific platform overrides in `pnpm-workspace.yaml` that cause `pnpm install --frozen-lockfile` (what Cloudflare runs automatically) to fail with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`. The `pages:build` script runs `pnpm install --no-frozen-lockfile` first, bypassing that check, then builds the site.

4. No environment variables are required for the build.
5. Click **Save and Deploy**.

> Cloudflare Pages automatically handles SPA routing via the `_redirects` file and applies security/cache headers from the `_headers` file.

### Custom Domain

After deploying, assign your domain (`vybetechnologies.net`) in the Cloudflare Pages dashboard under **Custom domains**.

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
