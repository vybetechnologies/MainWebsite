// Clerk publishable keys are designed to ship in client bundles (unlike the
// secret key) — Cloudflare Pages has no build-time env var wiring for this
// project, so the key is committed here directly rather than read from
// process.env, mirroring how the Sanity project ID is handled in this repo.
export const CLERK_PUBLISHABLE_KEY = 'pk_test_c3RpcnJpbmctY3JhYi0xMC5jbGVyay5hY2NvdW50cy5kZXYk';
