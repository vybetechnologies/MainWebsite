import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';

/**
 * Read-only Sanity client used for build-time content fetches (this site is
 * statically exported, so all fetches happen during `next build`, not at
 * request time). The `production` dataset is public-read, so no API token
 * is required here — see studio/README.md for the editorial workflow.
 *
 * Server-only: this constructs a full Sanity client, which is not safe to
 * bundle into client components. Client components needing image URLs
 * should import `urlForImage` from `./image` instead.
 */
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  : null;
