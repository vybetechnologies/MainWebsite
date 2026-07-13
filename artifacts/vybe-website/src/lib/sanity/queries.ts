import { sanityClient } from './client';
import type { NewsArticle, NewsArticleSummary } from './types';

const SUMMARY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  category,
  publishedAt,
  summary,
  mainImage
}`;

/**
 * All published articles, newest first. Returns an empty array (never
 * throws) when Sanity isn't configured or the fetch fails, so the site can
 * still build/render before content exists.
 */
export async function getAllNewsArticles(): Promise<NewsArticleSummary[]> {
  if (!sanityClient) return [];
  try {
    return await sanityClient.fetch(
      `*[_type == "newsArticle" && defined(slug.current)] | order(publishedAt desc) ${SUMMARY_PROJECTION}`,
    );
  } catch {
    return [];
  }
}

export async function getLatestNewsArticles(limit: number): Promise<NewsArticleSummary[]> {
  if (!sanityClient) return [];
  try {
    return await sanityClient.fetch(
      `*[_type == "newsArticle" && defined(slug.current)] | order(publishedAt desc) [0...$limit] ${SUMMARY_PROJECTION}`,
      { limit },
    );
  } catch {
    return [];
  }
}

export async function getNewsArticleSlugs(): Promise<string[]> {
  if (!sanityClient) return [];
  try {
    const slugs: string[] = await sanityClient.fetch(
      `*[_type == "newsArticle" && defined(slug.current)].slug.current`,
    );
    return slugs;
  } catch {
    return [];
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!sanityClient) return null;
  try {
    const article = await sanityClient.fetch(
      `*[_type == "newsArticle" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        category,
        publishedAt,
        summary,
        mainImage,
        body
      }`,
      { slug },
    );
    return article ?? null;
  } catch {
    return null;
  }
}
