'use client';

import { useEffect, useState } from 'react';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { CtaPanel } from '@/components/shared/cta-panel';
import { Loader2, AlertCircle } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logo: string;
  category: string;
  description: string;
  website: string;
  displayOrder: number;
  active: boolean;
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-card-border bg-card p-7 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-card-border bg-background overflow-hidden">
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={40}
            height={40}
            className="object-contain max-h-10 max-w-10"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="flex flex-col gap-1 pt-0.5">
          <h3 className="font-display font-semibold text-lg leading-tight">{partner.name}</h3>
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {partner.category}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{partner.description}</p>
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-xs font-medium text-primary hover:underline"
      >
        Visit {partner.name} →
      </a>
    </div>
  );
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiBase = resolveApiBaseUrl(window.location.hostname) ?? '';
    fetch(`${apiBase}/api/partners`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setPartners(d.partners ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(partners.map((p) => p.category))];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container mx-auto px-6 md:px-12 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Our Partners
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Built on the shoulders of the best.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            VYBE Technologies partners with industry-leading companies across cloud infrastructure,
            device service, parts distribution, and software — so we can deliver the best possible
            technology experience to every customer we serve.
          </p>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          Loading partners…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-3 py-32 text-center text-muted-foreground">
          <AlertCircle size={24} className="text-destructive" />
          <p className="text-sm">Could not load partners. Please try refreshing.</p>
        </div>
      )}

      {/* Partner grid by category */}
      {!loading && !error && categories.map((category) => {
        const group = partners.filter((p) => p.category === category);
        return (
          <section key={category} className="container mx-auto px-6 md:px-12 py-10">
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground/60">{category}</h2>
              <div className="mt-3 h-px w-full bg-border/60" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Partnership CTA */}
      {!loading && (
        <section className="container mx-auto px-6 md:px-12 pt-12 pb-24">
          <CtaPanel
            eyebrow="Partner With VYBE"
            title="Want to work together?"
            description="If your organization is interested in partnering with VYBE Technologies, we'd love to hear from you."
            primaryAction={{ label: 'Contact Us', href: '/contact' }}
          />
        </section>
      )}
    </div>
  );
}
