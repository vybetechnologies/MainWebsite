import type { Metadata } from 'next';
import {
  Heart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Compass,
  KeyRound,
  MapPin,
  BadgeCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { ServiceCard } from '@/components/shared/service-card';
import { TeamCard } from '@/components/shared/team-card';
import { CtaPanel } from '@/components/shared/cta-panel';
import { CONTACT } from '@/lib/contact-info';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about VYBE Technologies — our mission, values, and commitment to North Dakota, headquartered in Fargo.',
};

const VALUES = [
  { icon: Heart, title: 'People First', description: 'Every decision starts with the person on the other side of it.' },
  { icon: Rocket, title: 'Build Boldly', description: 'We ship real products and services instead of waiting for permission.' },
  { icon: ShieldCheck, title: 'Earn Trust', description: 'Trust is earned through consistent, honest work — not marketing.' },
  { icon: Sparkles, title: 'Keep It Simple', description: 'Technology should feel obvious, not intimidating.' },
  { icon: Compass, title: 'Stay Curious', description: "We're always learning what technology should look like next." },
  { icon: KeyRound, title: 'Create Access', description: 'Great technology and support should reach everyone, not just the connected.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <Hero
        eyebrow="About VYBE"
        title={
          <>
            Technology, built <span className="text-gradient">around real life.</span>
          </>
        }
        description="VYBE Technologies is a technology company building digital products, delivering technology services, and powering business solutions — headquartered in Fargo, North Dakota."
      />

      <section className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Our Story
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Started by solving one problem at a time.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              VYBE Technologies began with a simple observation: technology was supposed to make
              life easier, but for most people — and most small businesses — it had become a
              source of stress instead. Broken laptops, confusing software, and impersonal IT
              support left people feeling stuck.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We set out to build a company that treats technology support as a craft, and
              treats the people who need it with patience and respect. That same approach now
              shapes every product and service we build.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Mission
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Make good technology reachable for everyone.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our mission is to bring high-end technology expertise to everyday people and
              growing businesses — delivered with clarity, patience, and real accountability.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether it's a household's first line of tech support or a business's entire
              digital backbone, we build and support technology like the people using it matter
              more than the technology itself.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Company Values
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              What guides every decision.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <ServiceCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Leadership
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              A message from our founder.
            </h2>
          </div>
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start">
            <TeamCard
              name="Mason Peterson"
              role="Founder & CEO"
              bio="Leads VYBE's product, service, and business strategy across the company's growing ecosystem."
            />
            <blockquote className="border-l-2 border-primary pl-6 md:pl-10">
              <p className="text-xl md:text-2xl font-display leading-relaxed text-foreground mb-6">
                "VYBE exists because technology should work for people, not the other way
                around. We built this company to prove that a technology business can move fast,
                build real products, and still treat every customer like a neighbor — because in
                Fargo, most of them are."
              </p>
              <p className="text-muted-foreground">— Mason Peterson, Founder & CEO</p>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
                North Dakota Commitment
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Built here. Invested here.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                VYBE Technologies is headquartered in Fargo, North Dakota, and our roots here are
                intentional. We hire locally, support local families and businesses first, and
                reinvest in the community that gave us our start.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                As VYBE grows nationally, Fargo stays home base — the place our standards for
                service and craftsmanship come from.
              </p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-8 flex flex-col gap-6">
              <h3 className="font-display font-semibold text-lg">Corporate Information</h3>
              <div className="flex items-start gap-4">
                <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">VYBE Technologies Inc.</p>
                  <p className="text-sm text-muted-foreground">A registered, insured business.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-sm text-muted-foreground">
                    {CONTACT.addressLine1}
                    <br />
                    {CONTACT.addressLine2}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Founded</p>
                  <p className="text-sm text-muted-foreground">2026</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <BadgeCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Registered & Insured</p>
                  <p className="text-sm text-muted-foreground">
                    Book with confidence — every service is backed by a registered, insured
                    business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 pb-24">
        <CtaPanel
          eyebrow="Join Us"
          title="Interested in working with VYBE?"
          description="We're always meeting talented people who share our approach to technology."
          primaryAction={{ label: 'View Careers', href: '/careers' }}
          secondaryAction={{ label: 'Contact Us', href: '/contact' }}
        />
      </div>
    </div>
  );
}
