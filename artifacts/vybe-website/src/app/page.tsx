import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Building2,
  Wrench,
  Users,
  Cloud,
  FlaskConical,
  KeyRound,
  Laptop,
  Smartphone,
  Settings,
  ShieldAlert,
  ArrowLeftRight,
  MapPin,
  Briefcase,
  Lock,
  Mail,
  Globe,
  Compass,
  Rocket,
} from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { DoubleVVisual } from '@/components/shared/double-v-visual';
import { ServiceCard } from '@/components/shared/service-card';
import { ConnectCard } from '@/components/shared/connect-card';
import { FeaturedProduct } from '@/components/shared/featured-product';
import { IconGridItem } from '@/components/shared/icon-grid-item';
import { MissionSection } from '@/components/shared/mission-section';
import { NewsCard } from '@/components/shared/news-card';
import { CtaPanel } from '@/components/shared/cta-panel';
import { MobileStickyCta } from '@/components/shared/mobile-sticky-cta';

const OVERVIEW_CATEGORIES = [
  {
    icon: Sparkles,
    title: 'Digital Products',
    description: 'A growing ecosystem of VYBE-built software and hardware.',
  },
  {
    icon: Cpu,
    title: 'Technology Services',
    description: 'Repair, setup, and support for people and their devices.',
  },
  {
    icon: Building2,
    title: 'Business Solutions',
    description: 'Managed IT, security, and infrastructure for growing teams.',
  },
  {
    icon: ShieldCheck,
    title: 'Research & Innovation',
    description: 'VYBE Labs explores what technology should look like next.',
  },
];

const CONNECT_CARDS = [
  {
    icon: Wrench,
    title: 'VYBE Tech Rescue',
    description: 'Device repair, technical support, diagnostics, setup, and on-site assistance.',
    cta: 'Explore Tech Rescue',
    href: '/tech-rescue',
  },
  {
    icon: Users,
    title: 'VYBE Circle',
    description: 'A social platform built around community, identity, creativity, and genuine connection.',
    cta: 'Discover VYBE Circle',
    href: '/products#circle',
  },
  {
    icon: Cloud,
    title: 'VYBE Cloud & Business',
    description: 'Infrastructure, managed services, productivity, identity, and technology solutions for organizations.',
    cta: 'Solutions for Business',
    href: '/solutions#businesses',
  },
  {
    icon: FlaskConical,
    title: 'VYBE Labs',
    description: 'Experimental products, research, emerging technologies, and future concepts from VYBE Technologies.',
    cta: 'Visit VYBE Labs',
    href: '/products',
  },
];

const SERVICES = [
  { icon: Laptop, label: 'Computer Repair' },
  { icon: Smartphone, label: 'Phone and Tablet Repair' },
  { icon: Settings, label: 'Device Setup' },
  { icon: ShieldAlert, label: 'Virus and Malware Removal' },
  { icon: ArrowLeftRight, label: 'Data Transfer' },
  { icon: MapPin, label: 'On-Site Support' },
  { icon: Briefcase, label: 'Business IT Support' },
  { icon: Lock, label: 'Cybersecurity Assistance' },
];

const BUSINESS_SOLUTIONS = [
  {
    icon: Settings,
    title: 'Managed Technology',
    description: "Proactive management and monitoring of your organization's technology.",
  },
  {
    icon: Mail,
    title: 'Microsoft 365 and Google Workspace',
    description: 'Setup, administration, and ongoing support for the tools your team relies on.',
  },
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Infrastructure and hosting built to scale with your organization.',
  },
  {
    icon: KeyRound,
    title: 'Identity and Access',
    description: 'Secure identity management so the right people have the right access.',
  },
  {
    icon: ShieldCheck,
    title: 'Cybersecurity',
    description: 'Threat protection, monitoring, and response for your organization.',
  },
  {
    icon: Laptop,
    title: 'Device Management',
    description: 'Deployment, updates, and support for every device your team uses.',
  },
  {
    icon: Globe,
    title: 'Websites and Digital Platforms',
    description: 'Custom websites and digital platforms built to represent your organization.',
  },
  {
    icon: Compass,
    title: 'Technology Consulting',
    description: 'Strategic guidance for organizations planning their next technology move.',
  },
];

const NEWS_ITEMS = [
  {
    category: 'Product Update',
    date: 'June 2026',
    title: 'VYBE Key Waitlist Now Open',
    summary:
      'Our first hardware identity product enters development. Join the waitlist to be among the first to know when VYBE Key is ready.',
    href: '/newsroom',
  },
  {
    category: 'Company News',
    date: 'May 2026',
    title: 'VYBE Technologies Opens Its Doors in Fargo, North Dakota',
    summary:
      'VYBE Technologies launches with a mission to build practical digital products and human-centered technology services from the ground up.',
    href: '/newsroom',
  },
  {
    category: 'Community Initiative',
    date: 'April 2026',
    title: 'VYBE Labs Begins Work on Future Concepts',
    summary:
      'Our research and innovation team starts exploring the experimental products and emerging technologies that will shape what VYBE builds next.',
    href: '/newsroom',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col pb-24 lg:pb-0">
      <Hero
        eyebrow="VYBE Technologies"
        title={
          <>
            Technology built <span className="text-gradient">around real life.</span>
          </>
        }
        description="VYBE Technologies creates digital products, business solutions, and human-centered technology services designed to make life simpler, safer, and more connected."
        primaryAction={{ label: 'Explore VYBE', href: '/solutions' }}
        secondaryAction={{ label: 'Get Technology Support', href: '/tech-rescue' }}
        visual={<DoubleVVisual />}
      />

      {/* Company Overview Strip */}
      <section className="container mx-auto grid gap-6 px-6 py-20 sm:grid-cols-2 md:px-12 lg:grid-cols-4">
        {OVERVIEW_CATEGORIES.map((category) => (
          <ServiceCard
            key={category.title}
            icon={category.icon}
            title={category.title}
            description={category.description}
          />
        ))}
      </section>

      {/* One Company. Many Ways to Connect. */}
      <section className="container mx-auto px-6 py-20 md:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            One Company. Many Ways to Connect.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONNECT_CARDS.map((card) => (
            <ConnectCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* Featured Product */}
      <FeaturedProduct
        icon={KeyRound}
        name="VYBE Key"
        tagline="Your identity. Your access. Your control."
        description="A secure hardware-based identity and authentication product designed to help people protect their digital lives."
        features={[
          'Hardware-based, passwordless authentication',
          'Designed to protect your accounts and identity',
          'Built with privacy and security at the core',
        ]}
        status="coming-soon"
        primaryAction={{ label: 'Join Waitlist', href: '/products#key' }}
      />

      {/* Services */}
      <section className="container mx-auto px-6 py-20 md:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Technology support without the runaround.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {SERVICES.map((service) => (
            <IconGridItem key={service.label} icon={service.icon} label={service.label} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/tech-rescue"
            className="inline-flex px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium glow-primary hover:opacity-90 transition-opacity"
          >
            Book a Service
          </Link>
        </div>
      </section>

      {/* Business Solutions */}
      <section className="bg-card/40 border-y border-white/5">
        <div className="container mx-auto px-6 py-20 md:px-12">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
              Built for growing organizations.
            </h2>
            <p className="text-lg text-muted-foreground">
              VYBE helps small businesses and growing teams manage technology, security,
              communication, devices, and digital operations.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_SOLUTIONS.map((solution) => (
              <ServiceCard
                key={solution.title}
                icon={solution.icon}
                title={solution.title}
                description={solution.description}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
            >
              Talk to VYBE Business
            </Link>
          </div>
        </div>
      </section>

      <MissionSection />

      {/* Newsroom Preview */}
      <section className="container mx-auto px-6 py-20 md:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">From the Newsroom</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <NewsCard key={item.title} {...item} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/newsroom"
            className="inline-flex px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
          >
            View Newsroom
          </Link>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="container mx-auto px-6 py-20 md:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-card-border bg-card px-8 py-16 text-center md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-vybe opacity-10 blur-3xl"
          />
          <div className="relative">
            <Rocket className="mx-auto mb-6 h-10 w-10 text-primary" />
            <h2 className="mx-auto mb-4 max-w-2xl font-display text-3xl font-bold md:text-5xl">
              Help build what comes next.
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              We are building a company for curious people who believe technology should be
              ambitious, useful, and human.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/careers"
                className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium glow-primary hover:opacity-90 transition-opacity"
              >
                View Open Roles
              </Link>
              <Link
                href="/about"
                className="px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
              >
                Meet VYBE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="container mx-auto px-6 pb-24 md:px-12">
        <CtaPanel
          eyebrow="Let's Connect"
          title="Let's build something better."
          description="Whether it's a broken laptop or a growing business, VYBE is built to help."
          primaryAction={{ label: 'Contact VYBE', href: '/contact' }}
          secondaryAction={{ label: 'Get Support', href: '/tech-rescue' }}
        />
      </div>

      <MobileStickyCta />
    </div>
  );
}
