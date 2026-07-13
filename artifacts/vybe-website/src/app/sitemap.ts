import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getNewsArticleSlugs } from '@/lib/sanity/queries';

// Required for static export (`output: 'export'`) — see
// https://nextjs.org/docs/advanced-features/static-html-export
export const dynamic = 'force-static';

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/solutions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/products', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tech-rescue', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/newsroom', changeFrequency: 'daily', priority: 0.6 },
  { path: '/careers', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/accessibility', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/security', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/legal-notices', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const slugs = await getNewsArticleSlugs();
  const articleEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/newsroom/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticEntries, ...articleEntries];
}
