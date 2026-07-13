import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, organizationJsonLd } from '@/lib/seo';
import './globals.css';

const DEFAULT_DESCRIPTION =
  'VYBE Technologies is a technology company building digital products, delivering technology services, and powering business solutions — headquartered in Fargo, North Dakota.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'VYBE Technologies | Technology built around real life.',
    template: '%s | VYBE Technologies',
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VYBE Technologies | Technology built around real life.',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VYBE Technologies | Technology built around real life.',
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Organization structured data — describes VYBE Technologies as an
            entity to search engines site-wide (schema.org/Organization). */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus-visible:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col pt-20 md:pt-0">
            {children}
          </main>
          <Footer />
          <PageViewTracker />
        </Providers>
      </body>
    </html>
  );
}
