import type { Metadata } from 'next';
import { CheckCircle2, Laptop, ShieldCheck, Sparkles, Building2, Network, Users2, HeartHandshake, Wifi, GraduationCap } from 'lucide-react';
import { CtaPanel } from '@/components/shared/cta-panel';

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Technology solutions from VYBE Technologies for individuals, businesses, and communities — device repair, managed IT, cybersecurity, and community technology access.',
};

interface SolutionItem {
  icon: typeof Laptop;
  title: string;
  description: string;
}

function SolutionSection({
  id,
  eyebrow,
  title,
  description,
  items,
  cta,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: SolutionItem[];
  cta: { label: string; href: string; description: string };
}) {
  return (
    <section id={id} className="py-20 md:py-28 border-b border-border/60 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">{title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-border bg-card/50 p-8">
          <div className="flex items-start gap-3 max-w-lg">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground">{cta.description}</p>
          </div>
          <a
            href={cta.href}
            className="shrink-0 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-center"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function SolutionsPage() {
  return (
    <div className="flex flex-col">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-vybe opacity-15 blur-3xl"
        />
        <div className="container mx-auto px-6 md:px-12 relative">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Solutions
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold max-w-3xl mb-6">
            Technology support built for who you are.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Whether you're one person with a slow laptop, a business scaling its network, or an
            entire community that needs better access — VYBE meets you where you're at.
          </p>
        </div>
      </section>

      <SolutionSection
        id="individuals"
        eyebrow="For Individuals"
        title="Personal tech that just works."
        description="Real, human help for the everyday technology in your life — no jargon, no upsells, just things fixed and explained."
        items={[
          {
            icon: Laptop,
            title: 'Device Repair & Tech Rescue',
            description:
              'On-demand help for slow computers, Wi-Fi drops, printer issues, and device setup.',
          },
          {
            icon: HeartHandshake,
            title: 'Home Tech Care',
            description:
              'An ongoing subscription with monthly checkups, remote support, and priority scheduling.',
          },
          {
            icon: ShieldCheck,
            title: 'Cybersecurity & Scam Protection',
            description:
              'Scam cleanup, antivirus setup, and safe-browsing habits that protect what matters.',
          },
          {
            icon: Sparkles,
            title: 'AI Setup & Training',
            description:
              'Learn to use modern AI tools to save time, write better, and get more done.',
          },
          {
            icon: Wifi,
            title: 'Home Network Setup',
            description: 'Reliable Wi-Fi coverage, smart home device setup, and network troubleshooting.',
          },
        ]}
        cta={{
          label: 'Get Tech Rescue',
          href: '/tech-rescue',
          description: 'Need something fixed today? Book a Tech Rescue session in minutes.',
        }}
      />

      <SolutionSection
        id="businesses"
        eyebrow="For Businesses"
        title="Your outsourced IT department."
        description="Predictable, managed technology for small and growing businesses — so you can focus on running the business, not troubleshooting it."
        items={[
          {
            icon: Building2,
            title: 'Managed IT Services',
            description:
              'Ongoing device setup, monitoring, and support with a single predictable monthly cost.',
          },
          {
            icon: Network,
            title: 'Network & Wi-Fi Management',
            description:
              'Fast, secure office networks with guest access segregated from internal data.',
          },
          {
            icon: ShieldCheck,
            title: 'Cybersecurity & Endpoint Protection',
            description:
              'Next-generation antivirus and proactive threat monitoring across every company device.',
          },
          {
            icon: Users2,
            title: 'Employee Onboarding & Access',
            description:
              'Fast, secure onboarding and offboarding for Microsoft 365, Google Workspace, and shared drives.',
          },
          {
            icon: HeartHandshake,
            title: 'Priority Emergency Support',
            description: 'Skip the line when something breaks — business clients get priority response.',
          },
        ]}
        cta={{
          label: 'Talk to Us',
          href: '/contact',
          description: 'Tell us about your business and we\'ll put together a plan that fits.',
        }}
      />

      <SolutionSection
        id="communities"
        eyebrow="For Communities"
        title="Technology access for everyone."
        description="We partner with schools, nonprofits, and local organizations to close the technology gap — because good tech support shouldn't be a luxury."
        items={[
          {
            icon: GraduationCap,
            title: 'Senior Tech Literacy Workshops',
            description:
              'Hands-on sessions that help older adults use smartphones, video calls, and online banking safely.',
          },
          {
            icon: HeartHandshake,
            title: 'School & Nonprofit Device Support',
            description:
              'Discounted repair and refurbishment programs for schools, nonprofits, and community centers.',
          },
          {
            icon: Building2,
            title: 'Local Business Partnerships',
            description:
              'Preferred-rate technology support for other Fargo-area small businesses and makers.',
          },
        ]}
        cta={{
          label: 'Partner With Us',
          href: '/contact',
          description: 'Represent a school, nonprofit, or community group? Let\'s talk about a partnership.',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <CtaPanel
          eyebrow="Not Sure Where to Start?"
          title="Tell us what's going on — we'll point you in the right direction."
          description="Every solution above starts with a conversation. Reach out and we'll help you find the right fit."
          primaryAction={{ label: 'Contact VYBE', href: '/contact' }}
          secondaryAction={{ label: 'Explore Products', href: '/products' }}
        />
      </div>
    </div>
  );
}
