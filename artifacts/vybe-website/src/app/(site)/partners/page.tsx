import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';
import { CtaPanel } from '@/components/shared/cta-panel';

export const metadata = buildMetadata({
  title: 'Partners',
  description:
    'VYBE Technologies partners with industry-leading companies to deliver the best technology, parts, cloud infrastructure, and services to our customers.',
  path: '/partners',
});

interface Partner {
  name: string;
  logo: string;
  category: string;
  description: string;
  website: string;
}

const PARTNERS: Partner[] = [
  {
    name: 'Microsoft',
    logo: '/partners/microsoft.png',
    category: 'Cloud & Software',
    description:
      'As a Microsoft AI Cloud Partner, we deliver Microsoft\'s full commercial portfolio — from Microsoft 365 and Azure cloud services to Windows-based business solutions for teams of every size.',
    website: 'https://microsoft.com',
  },
  {
    name: 'Google',
    logo: '/partners/google.svg',
    category: 'Cloud & Workspace',
    description:
      'Our Google partnership gives customers access to Google Workspace and Google Cloud solutions — collaboration tools, storage, and enterprise-grade infrastructure backed by Google\'s global network.',
    website: 'https://google.com',
  },
  {
    name: 'Apple',
    logo: '/partners/apple.svg',
    category: 'Device Service',
    description:
      'VYBE Technologies is authorized to service Apple devices. Our Tech Rescue technicians handle iPhone, iPad, Mac, and Apple Watch repairs with genuine parts and proper diagnostic tools.',
    website: 'https://apple.com',
  },
  {
    name: 'Samsung',
    logo: '/partners/samsung.svg',
    category: 'Device Service',
    description:
      'Certified to repair Samsung smartphones, tablets, and devices. From Galaxy screen replacements to software issues, our team handles Samsung hardware with the care it deserves.',
    website: 'https://samsung.com',
  },
  {
    name: 'Cloudflare',
    logo: '/partners/cloudflare.png',
    category: 'Infrastructure',
    description:
      'Our customer-facing websites run on Cloudflare Pages and are protected by Cloudflare\'s global edge network — delivering fast load times, DDoS protection, and zero-trust security at scale.',
    website: 'https://cloudflare.com',
  },
  {
    name: 'Fly.io',
    logo: '/partners/flyio.png',
    category: 'Infrastructure',
    description:
      'VYBE\'s API and backend services are deployed on Fly.io\'s globally distributed compute platform — giving our applications low-latency, resilient infrastructure close to our users.',
    website: 'https://fly.io',
  },
  {
    name: 'Neon',
    logo: '/partners/neon.svg',
    category: 'Infrastructure',
    description:
      'Our production databases run on Neon\'s serverless Postgres platform, a Databricks company — delivering autoscaling, branching, and instant provisioning for modern application workloads.',
    website: 'https://neon.tech',
  },
  {
    name: 'Pax8',
    logo: '/partners/pax8.png',
    category: 'Cloud Marketplace',
    description:
      'Through our Pax8 partnership, we source and deliver hundreds of leading cloud products to business customers — simplifying procurement, licensing, and support under one roof.',
    website: 'https://pax8.com',
  },
  {
    name: 'iFixit',
    logo: '/partners/ifixit.svg',
    category: 'Repair & Parts',
    description:
      'iFixit is the world\'s largest open repair community and a trusted source for quality device parts. Their repair guides and components power a significant part of our Tech Rescue toolkit.',
    website: 'https://ifixit.com',
  },
  {
    name: 'Mobilesentrix',
    logo: '/partners/mobilesentrix.png',
    category: 'Repair & Parts',
    description:
      'Mobilesentrix is a premier wholesale distributor of mobile device replacement parts. Our partnership ensures our repair inventory is stocked with high-quality components at competitive prices.',
    website: 'https://mobilesentrix.com',
  },
  {
    name: 'Square',
    logo: '/partners/square.svg',
    category: 'Payments',
    description:
      'VYBE Technologies uses Square to power secure, seamless payments across the platform — from Tech Rescue repair deposits and staff-generated invoices to full catalog checkout in the VYBE Marketplace. Square handles card processing, order tracking, and receipts so customers can pay with confidence.',
    website: 'https://squareup.com',
  },
  {
    name: 'Stripe',
    logo: '/partners/stripe.svg',
    category: 'Payments',
    description:
      "Stripe powers VYBE's global payout infrastructure, enabling earnings to flow directly to customer wallets and bank accounts across 46+ countries. From payment processing to financial automation, Stripe keeps our platform moving money reliably and securely.",
    website: 'https://stripe.com',
  },
  {
    name: 'Bluevine',
    logo: '/partners/bluevine.svg',
    category: 'Banking & Finance',
    description:
      'Bluevine provides VYBE Technologies with modern business banking built for growth — including high-yield checking, lines of credit, and bill pay. Their small-business-first approach aligns with our commitment to keeping VYBE financially agile and operationally strong.',
    website: 'https://bluevine.com',
  },
  {
    name: 'Wave Advisors',
    logo: '/partners/wave.svg',
    category: 'Banking & Finance',
    description:
      "Wave Advisors supports VYBE's financial operations with expert accounting, bookkeeping, and advisory services — helping us maintain clean books, stay tax-ready, and make data-driven financial decisions as we scale.",
    website: 'https://waveapps.com',
  },
];

const CATEGORIES = [...new Set(PARTNERS.map((p) => p.category))];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-card-border bg-card p-7 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-card-border bg-background overflow-hidden">
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={40}
            height={40}
            className="object-contain"
            unoptimized
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

      {/* Partner grid by category */}
      {CATEGORIES.map((category) => {
        const group = PARTNERS.filter((p) => p.category === category);
        return (
          <section key={category} className="container mx-auto px-6 md:px-12 py-10">
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground/60">{category}</h2>
              <div className="mt-3 h-px w-full bg-border/60" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Partnership CTA */}
      <section className="container mx-auto px-6 md:px-12 pt-12 pb-24">
        <CtaPanel
          eyebrow="Partner With VYBE"
          title="Want to work together?"
          description="If your organization is interested in partnering with VYBE Technologies, we'd love to hear from you."
          primaryAction={{ label: 'Contact Us', href: '/contact' }}
        />
      </section>
    </div>
  );
}
