import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Required for static export (`output: 'export'`) — see
// https://nextjs.org/docs/advanced-features/static-html-export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
