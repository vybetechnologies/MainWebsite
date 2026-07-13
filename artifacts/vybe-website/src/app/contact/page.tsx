import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { CONTACT } from '@/lib/contact-info';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with VYBE Technologies by phone, email, or mail.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <Hero
        eyebrow="Contact"
        title="Let's talk about your technology."
        description="Our full contact form is on its way. Until then, here's the fastest way to reach a real person."
        visual={<div />}
      />
      <section className="container mx-auto px-6 md:px-12 pb-24">
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-card-border bg-card p-8 text-center hover:border-primary/40 transition-colors"
          >
            <Phone className="h-6 w-6 text-primary" />
            <span className="font-medium">{CONTACT.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-card-border bg-card p-8 text-center hover:border-primary/40 transition-colors"
          >
            <Mail className="h-6 w-6 text-primary" />
            <span className="font-medium">{CONTACT.email}</span>
          </a>
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-card-border bg-card p-8 text-center">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-medium">
              {CONTACT.addressLine1}
              <br />
              {CONTACT.addressLine2}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
