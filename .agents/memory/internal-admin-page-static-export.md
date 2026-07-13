---
name: Internal-only pages on a static-export Next site
description: How to add an admin/internal report page to a Next.js site built with output: 'export'.
---

vybe-website (`artifacts/vybe-website`) builds with `output: 'export'` (static HTML, no
Next server at runtime). That rules out Next middleware, API routes, and any
server-side auth check living in the website itself.

**Pattern used for the internal page-view report (`/admin/analytics`):**
- All data lives behind the separate `api-server` artifact; the admin page is a
  `'use client'` component that calls the api-server directly with `fetch`.
- Auth is a single shared-secret header (`x-admin-token`) checked server-side in
  api-server middleware via `crypto.timingSafeEqual`, not anything in Next.
- The page prompts for the token client-side and caches it in `sessionStorage`;
  a 401 response clears the cached token and re-prompts.
- Keep it out of search/sitemaps: `robots.ts` disallows `/admin/` and the page's
  own `metadata.robots` sets `index: false`.

**Why:** No server exists at runtime to gate the route, and there was no
existing auth system (no users/sessions) to reuse — a shared token was the
minimal correct fit for a small internal audience viewing non-PII aggregate
data.

**How to apply:** Reuse this pattern (shared-secret header + client-side fetch
+ robots exclusion) for any future internal/admin-only page on this site,
rather than reaching for Next middleware or route handlers.
