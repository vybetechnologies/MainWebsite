import type { Metadata } from 'next';

/**
 * Canonical production URL. Override with NEXT_PUBLIC_SITE_URL if the site
 * is ever served from a different domain (e.g. a staging environment).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vybetechnologies.net').replace(
  /\/+$/,
  '',
);

export const SITE_NAME = 'VYBE Technologies';
export const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * Builds a consistent Metadata object (title, description, canonical URL,
 * Open Graph, and Twitter card) for a single page. `path` must start with
 * `/` and match the page's route (e.g. `/about`, `/tech-rescue`).
 */
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  // `title` here feeds Next's title *template* (`%s | VYBE Technologies`),
  // but openGraph/twitter titles are taken verbatim, so build the full
  // string ourselves to keep social previews consistent with the <title> tag.
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${SITE_NAME} — ${title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Organization / LocalBusiness JSON-LD, rendered site-wide from the root
 * layout. Kept factual — only verifiable, publicly stated details.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/vybe-logo-transparent.png`,
    email: 'support@vybetechnologies.net',
    telephone: '+18882318923',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'PO Box 10034',
      addressLocality: 'Fargo',
      addressRegion: 'ND',
      postalCode: '58106',
      addressCountry: 'US',
    },
    sameAs: [],
  };
}

/**
 * LocalBusiness JSON-LD for the Tech Rescue service line — rendered on the
 * Tech Rescue page in addition to the site-wide Organization markup.
 */
export function techRescueLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VYBE Tech Rescue',
    parentOrganization: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    url: `${SITE_URL}/tech-rescue`,
    telephone: '+18882318923',
    email: 'support@vybetechnologies.net',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fargo',
      addressRegion: 'ND',
      postalCode: '58106',
      addressCountry: 'US',
    },
    priceRange: '$$',
  };
}
