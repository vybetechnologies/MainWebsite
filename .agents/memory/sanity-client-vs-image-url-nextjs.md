---
name: Sanity client vs image-url in Next.js client components
description: Why importing @sanity/client from a 'use client' file crashes the browser bundle, and how to split modules to avoid it.
---

The Sanity data client (`@sanity/client`, via `createClient(...)`) is meant for server-side/build-time use. If any module that constructs a client (e.g. a shared `lib/sanity/client.ts` that does `export const sanityClient = createClient(...)` at module scope) gets imported — even just for an unrelated helper in the same file — by a `'use client'` component, webpack bundles the client into the browser, and it throws at runtime with a generic, unhelpful "Application error: a client-side exception has occurred" (no stack trace shown by Next's overlay, only visible via browser devtools/breaking it apart manually).

**Why:** `@sanity/image-url`'s URL builder is pure/browser-safe, but if it lives in the *same file* as the data client, importing "just the image helper" still pulls in the client construction code.

**How to apply:** Put the image URL builder in its own module (e.g. `lib/sanity/image.ts`) with zero imports from `@sanity/client`, safe to import from both server and client components. Keep the data client in a separate server-only module. The image module needs its Sanity project id/dataset available in the browser bundle, so read them from `NEXT_PUBLIC_`-prefixed env vars (safe to expose — they just point at Sanity's public image CDN), while the server-only client module can use unprefixed env vars.
