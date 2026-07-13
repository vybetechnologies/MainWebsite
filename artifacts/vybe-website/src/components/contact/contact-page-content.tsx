'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { CONTACT } from '@/lib/contact-info';
import { InquiryPathGrid, InquiryForm } from '@/components/contact/inquiry-form';

export function ContactPageContent() {
  const [inquiryType, setInquiryType] = useState('General Inquiries');

  return (
    <div className="flex flex-col">
      <Hero
        eyebrow="Contact"
        title="Let's talk about your technology."
        description="Whether it's a quick question or a business partnership, tell us what you need and we'll route it to the right person."
        visual={<div />}
      />

      <section className="container mx-auto px-6 md:px-12 pb-16">
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

      <section className="container mx-auto px-6 md:px-12 pb-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Where should this go?
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Pick the option that fits best.
          </h2>
        </div>
        <InquiryPathGrid selected={inquiryType} onSelect={setInquiryType} />
      </section>

      <section className="container mx-auto px-6 md:px-12 pb-24">
        <div className="max-w-2xl mx-auto rounded-3xl border border-card-border bg-card p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Send a message</h2>
          <InquiryForm inquiryType={inquiryType} onInquiryTypeChange={setInquiryType} />
        </div>
      </section>
    </div>
  );
}
