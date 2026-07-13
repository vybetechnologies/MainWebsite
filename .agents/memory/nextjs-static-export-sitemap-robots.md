---
name: Next.js static export sitemap/robots
description: How to add app/sitemap.ts and app/robots.ts to a Next.js site using output:'export'
---

Adding `src/app/sitemap.ts` / `src/app/robots.ts` to a Next.js App Router site with `output: 'export'` in `next.config` fails the build unless each file also exports `export const dynamic = 'force-static';`. Without it, `next build` throws "export const dynamic ... not configured on route ... with output: export".

Also: a static `public/robots.txt` file and an `app/robots.ts` route cannot coexist — remove the static file once the route exists, or the export step will conflict.

**Why:** static export needs every route to be statically resolvable at build time; sitemap/robots route handlers default to dynamic unless told otherwise.

**How to apply:** whenever adding sitemap.xml/robots.txt generation to a statically-exported Next.js app, add the `dynamic = 'force-static'` export to both files up front, and check for a conflicting `public/robots.txt`.
