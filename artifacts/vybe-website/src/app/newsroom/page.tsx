import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Mail, Phone } from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { CONTACT } from '@/lib/contact-info';
import { getAllNewsArticles } from '@/lib/sanity/queries';
import { NewsroomFilter } from './newsroom-filter';

export const metadata: Metadata = {
  title: 'Newsroom',
  description:
    'Press releases, product announcements, company news, and community initiatives from VYBE Technologies.',
};

const BRAND_ASSETS = [
  { label: 'VYBE Logo Mark (PNG)', href: '/logo-mark.png' },
  { label: 'VYBE Logo (Transparent)', href: '/vybe-logo-transparent.png' },
];

export default async function NewsroomPage() {
  const articles = await getAllNewsArticles();

  return (
    <div className="flex flex-col pb-24">
      <Hero
        eyebrow="Newsroom"
        title="News from VYBE Technologies."
        description="Press releases, product announcements, company news, and community initiatives — straight from the source."
        visual={<div />}
      />

      <section className="container mx-auto px-6 pb-20 md:px-12">
        <NewsroomFilter articles={articles} />
      </section>

      {/* Media Assets & Brand Downloads */}
      <section className="bg-card/40 border-y border-white/5">
        <div className="container mx-auto px-6 py-16 md:px-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold md:text-4xl">Media Assets & Brand Downloads</h2>
            <p className="mt-3 text-muted-foreground">
              Logos and brand marks for journalists and partners covering VYBE Technologies.
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            {BRAND_ASSETS.map((asset) => (
              <a
                key={asset.href}
                href={asset.href}
                download
                className="flex items-center justify-between gap-3 rounded-2xl border border-card-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <span className="font-medium">{asset.label}</span>
                <Download className="h-4 w-4 text-primary" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="container mx-auto px-6 py-20 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-display text-2xl font-bold md:text-4xl">Press Contact</h2>
          <p className="mb-8 text-muted-foreground">
            For interview requests, press inquiries, or additional information, reach out directly.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium glow-primary hover:opacity-90 transition-opacity"
            >
              <Mail className="h-4 w-4" /> {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
            >
              <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
            </a>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Looking for general support instead?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Visit our contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
