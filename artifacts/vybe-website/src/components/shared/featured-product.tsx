import Link from 'next/link';
import { Check, LucideIcon } from 'lucide-react';
import { StatusBadge, type ProductStatus } from './status-badge';

/**
 * Large split-layout spotlight for the current flagship product. Built as a
 * standalone, prop-driven component so a different product can be featured
 * here later without touching the homepage layout.
 */
export function FeaturedProduct({
  eyebrow = 'Featured Product',
  icon: Icon,
  name,
  tagline,
  description,
  features,
  status,
  primaryAction,
}: {
  eyebrow?: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  status: ProductStatus;
  primaryAction: { label: string; href: string };
}) {
  return (
    <section className="container mx-auto px-6 md:px-12 py-20">
      <div className="relative grid gap-12 overflow-hidden rounded-3xl border border-card-border bg-card p-8 md:p-14 lg:grid-cols-2 lg:gap-16 items-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-vybe opacity-20 blur-3xl" />

        <div className="relative order-2 lg:order-1">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            {eyebrow}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="font-display font-bold text-3xl md:text-4xl">{name}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-lg text-foreground/90 mb-3">{tagline}</p>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">{description}</p>
          <ul className="flex flex-col gap-3 mb-10">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
                <Check className="h-4 w-4 text-accent-cyan shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href={primaryAction.href}
            className="inline-flex px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium glow-primary hover:opacity-90 transition-opacity"
          >
            {primaryAction.label}
          </Link>
        </div>

        <div className="relative order-1 lg:order-2 flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-vybe opacity-30 blur-2xl" />
            <div className="absolute inset-6 flex items-center justify-center rounded-[1.75rem] border border-primary/30 bg-background/40 backdrop-blur-sm">
              <Icon className="h-20 w-20 text-primary" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
