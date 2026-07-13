import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImage } from './types';

// Must use the NEXT_PUBLIC_ prefix: this module is imported by client
// components, and only NEXT_PUBLIC_-prefixed env vars are inlined into the
// browser bundle. Image URLs point at Sanity's public CDN, so exposing the
// project id/dataset here is safe (they are not secrets).
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * Safe to import from both server and client components: unlike `./client`,
 * this never constructs a Sanity data client, only the pure, browser-safe
 * image URL builder.
 */
const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlForImage(source: SanityImage) {
  if (!builder) {
    throw new Error('Sanity image URL builder is not configured (missing SANITY_PROJECT_ID).');
  }
  return builder.image(source);
}
