// Clerk publishable keys are designed to ship in client bundles (unlike the
// secret key). Cloudflare Pages has no build-time env var wiring for this
// project, so the key is committed here directly — the same pattern used for
// the Sanity project ID in this repo.
// This is the external (user-owned) Clerk instance.
export const CLERK_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsudnliZXRlY2hub2xvZ2llcy5uZXQk';
