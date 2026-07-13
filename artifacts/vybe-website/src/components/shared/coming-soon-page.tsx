import { ReactNode } from 'react';
import { Hero } from '@/components/shared/hero';
import { CtaPanel } from '@/components/shared/cta-panel';
import { CONTACT } from '@/lib/contact-info';

/**
 * Lightweight placeholder for routes owned by other in-flight page tasks
 * (Tech Rescue booking, About/Careers/Contact, Newsroom, Legal). Keeps every
 * nav/footer/CTA link resolving to a real page instead of a 404 until the
 * dedicated task replaces this file with full content.
 */
export function ComingSoonPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Hero eyebrow={eyebrow} title={title} description={description} visual={<div />} />
      {children}
      <div className="container mx-auto px-6 md:px-12 pb-24">
        <CtaPanel
          eyebrow="In the Meantime"
          title="Reach us directly and we'll take it from there."
          description="This page is still being built out — but our team is already reachable."
          primaryAction={{ label: `Call ${CONTACT.phoneDisplay}`, href: `tel:${CONTACT.phoneTel}` }}
          secondaryAction={{ label: 'Back to Home', href: '/' }}
        />
      </div>
    </div>
  );
}
