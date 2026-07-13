import { ReactNode } from 'react';
import { Hero } from '@/components/shared/hero';

/**
 * Shared layout for legal/compliance pages (Privacy, Terms, Accessibility,
 * Security, Legal Notices). Renders a consistent hero + typographic prose
 * container so long-form policy text stays readable and on-brand.
 */
export function LegalPage({
  eyebrow = 'Legal',
  title,
  description,
  lastUpdated,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col pb-24">
      <Hero eyebrow={eyebrow} title={title} description={description} visual={<div />} />
      <div className="container mx-auto px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-10 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          <div
            className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
