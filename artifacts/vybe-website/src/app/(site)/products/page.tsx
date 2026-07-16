import Link from 'next/link';
import {
  Users2,
  KeyRound,
  Mail,
  Music,
  Tv,
  Fingerprint,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import { ProductCard } from '@/components/shared/product-card';
import { StatusBadge, type ProductStatus } from '@/components/shared/status-badge';
import { CtaPanel } from '@/components/shared/cta-panel';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Products',
  description:
    "Explore the VYBE Technologies product ecosystem — VYBE Circle, VYBE Key, VYBE Mail, VYBE Sound, VYBE TV, VYBE ID, and VYBE HUB.",
  path: '/products',
});

interface Product {
  id: string;
  icon: typeof Users2;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  status: ProductStatus;
}

const PRODUCTS: Product[] = [
  {
    id: 'hub',
    icon: LayoutDashboard,
    name: 'VYBE HUB',
    tagline: 'One home for everything VYBE.',
    description: 'A single dashboard to manage every VYBE product, service, and support ticket.',
    longDescription:
      'VYBE HUB brings your Tech Rescue history, service subscriptions, billing, and every other VYBE product into one place. It\'s the account layer the rest of the ecosystem is being built on top of.',
    status: 'in-development',
  },
  {
    id: 'id',
    icon: Fingerprint,
    name: 'VYBE ID',
    tagline: 'One login, all of VYBE.',
    description: 'A single sign-on identity for every VYBE product and service.',
    longDescription:
      'VYBE ID is the account and authentication system that will let you move between VYBE Circle, VYBE Mail, VYBE HUB, and future products with one secure login.',
    status: 'in-development',
  },
  {
    id: 'key',
    icon: KeyRound,
    name: 'VYBE Key',
    tagline: 'Passwordless, by design.',
    description: 'A physical hardware key for secure, passwordless access to your accounts.',
    longDescription:
      'VYBE Key is a planned hardware security key that replaces passwords with a tap. It\'s designed for people who want strong security without having to remember anything.',
    status: 'coming-soon',
  },
  {
    id: 'mail',
    icon: Mail,
    name: 'VYBE Mail',
    tagline: 'Email without the noise.',
    description: 'A clean, privacy-respecting email service built for people, not advertisers.',
    longDescription:
      'VYBE Mail is an early-stage concept for an email service that skips the ad-tracking and clutter of mainstream providers, built around the same straightforward philosophy as our support services.',
    status: 'concept',
  },
  {
    id: 'circle',
    icon: Users2,
    name: 'VYBE Circle',
    tagline: 'Community, without the noise.',
    description: 'A community-first social platform built with privacy in mind.',
    longDescription:
      'VYBE Circle is a concept for a smaller, community-oriented alternative to mainstream social platforms — focused on real local connections rather than algorithmic feeds.',
    status: 'concept',
  },
  {
    id: 'sound',
    icon: Music,
    name: 'VYBE Sound',
    tagline: 'Audio, reimagined.',
    description: 'An early-concept audio and music product from the VYBE ecosystem.',
    longDescription:
      'VYBE Sound is an early concept exploring audio hardware and software experiences. There\'s no defined product yet — just an idea worth exploring as the ecosystem grows.',
    status: 'concept',
  },
  {
    id: 'tv',
    icon: Tv,
    name: 'VYBE TV',
    tagline: 'Media, on your terms.',
    description: 'An early-concept media and streaming product from the VYBE ecosystem.',
    longDescription:
      'VYBE TV is an early concept for a media experience tied into the rest of the VYBE ecosystem. It\'s not in active development yet, but it\'s on the long-term roadmap.',
    status: 'concept',
  },
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-vybe opacity-15 blur-3xl"
        />
        <div className="container mx-auto px-6 md:px-12 relative">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Products
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold max-w-3xl mb-6">
            One ecosystem, built one product at a time.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            VYBE Technologies is more than a repair shop — we're building a family of digital
            products alongside our services. Here's where each one stands today.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              icon={product.icon}
              name={product.name}
              description={product.description}
              status={product.status}
              href={`#${product.id}`}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="container mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col gap-16">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              id={product.id}
              className="grid lg:grid-cols-[auto_1fr] gap-8 items-start scroll-mt-24"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-vybe">
                <product.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-2xl md:text-3xl font-display font-bold">{product.name}</h2>
                  <StatusBadge status={product.status} />
                </div>
                <p className="text-primary font-medium mb-3">{product.tagline}</p>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">
                  {product.longDescription}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Get notified when this ships <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <CtaPanel
          eyebrow="Building Something?"
          title="Want early access as these products take shape?"
          description="Reach out and we'll keep you posted as each product moves from concept to reality."
          primaryAction={{ label: 'Get Notified', href: '/contact' }}
          secondaryAction={{ label: 'View Solutions', href: '/solutions' }}
        />
      </div>
    </div>
  );
}
