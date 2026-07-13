import { Sparkles, ShieldCheck, Cpu, Building2 } from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { ServiceCard } from '@/components/shared/service-card';
import { ProductCard } from '@/components/shared/product-card';
import { MetricCard } from '@/components/shared/metric-card';
import { CtaPanel } from '@/components/shared/cta-panel';

/**
 * Temporary verification route for the Next.js migration & design system
 * foundation. It proves the stack, styling, and shared component library
 * work end-to-end. The Home Page Redesign task replaces this with the full
 * homepage content.
 */
export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero
        eyebrow="VYBE Technologies"
        title={
          <>
            Technology built <span className="text-gradient">around real life.</span>
          </>
        }
        description="Digital products, technology services, and business solutions — engineered from Fargo, North Dakota."
        primaryAction={{ label: 'Explore VYBE', href: '/solutions' }}
        secondaryAction={{ label: 'Get Technology Support', href: '/tech-rescue' }}
      />

      <section className="container mx-auto px-6 md:px-12 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceCard icon={Sparkles} title="Digital Products" description="A growing ecosystem of VYBE-built software and hardware." />
        <ServiceCard icon={Cpu} title="Technology Services" description="Repair, setup, and support for people and their devices." />
        <ServiceCard icon={Building2} title="Business Solutions" description="Managed IT, security, and infrastructure for growing teams." />
        <ServiceCard icon={ShieldCheck} title="Research & Innovation" description="VYBE Labs explores what technology should look like next." />
      </section>

      <section className="container mx-auto px-6 md:px-12 py-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          icon={Sparkles}
          name="VYBE Key"
          description="A hardware identity key for passwordless access."
          status="coming-soon"
          href="/products#key"
        />
        <ProductCard
          icon={Cpu}
          name="VYBE Circle"
          description="A community-first social platform, built with privacy in mind."
          status="concept"
          href="/products#circle"
        />
        <ProductCard
          icon={Building2}
          name="VYBE HUB"
          description="One dashboard for every VYBE product and service."
          status="in-development"
          href="/products#hub"
        />
      </section>

      <section className="container mx-auto px-6 md:px-12 py-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard value="2026" label="Founded" />
        <MetricCard value="Fargo, ND" label="Headquarters" />
        <MetricCard value="7+" label="Products in the ecosystem" />
        <MetricCard value="100%" label="People-first support" />
      </section>

      <div className="container mx-auto px-6 md:px-12 pb-24">
        <CtaPanel
          eyebrow="Get Started"
          title="Ready to put technology to work for you?"
          description="Whether it's a broken laptop or a growing business, VYBE is built to help."
          primaryAction={{ label: 'Contact VYBE', href: '/contact' }}
          secondaryAction={{ label: 'Get Support', href: '/tech-rescue' }}
        />
      </div>
    </div>
  );
}
