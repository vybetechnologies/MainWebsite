import {
  Laptop,
  Smartphone,
  Gamepad2,
  Home,
  Building2,
  MapPinned,
  MessageSquare,
  FileSearch,
  Wrench,
  Smile,
  ShieldCheck,
  Lock,
  Tag,
  BadgeCheck,
  UserCheck,
  MapPin,
} from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { ServiceCard } from '@/components/shared/service-card';
import { CONTACT } from '@/lib/contact-info';
import { BookingForm } from '@/components/tech-rescue/booking-form';
import { buildMetadata, techRescueLocalBusinessJsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Tech Rescue',
  description:
    'Book on-demand tech support with VYBE Technologies Tech Rescue — computers, phones, gaming devices, home and business technology, on-site or remote.',
  path: '/tech-rescue',
});

const SERVICE_CATEGORIES = [
  { icon: Laptop, title: 'Computers', description: 'Slow performance, viruses, crashes, upgrades, and everyday troubleshooting.' },
  { icon: Smartphone, title: 'Phones and Tablets', description: 'Screen issues, battery problems, setup, transfers, and account recovery.' },
  { icon: Gamepad2, title: 'Gaming Devices', description: 'Consoles and gaming PCs — connectivity, performance, and hardware issues.' },
  { icon: Home, title: 'Home Technology', description: 'Wi-Fi dead zones, smart home devices, printers, and networked gear.' },
  { icon: Building2, title: 'Business Technology', description: 'Office networks, shared drives, endpoint security, and employee devices.' },
  { icon: MapPinned, title: 'On-Site Support', description: "We come to you — no need to unplug anything or leave the house." },
];

const HOW_IT_WORKS = [
  { icon: MessageSquare, title: 'Tell us what\'s happening', description: 'Fill out the form below with the device and the problem — the more detail, the better.' },
  { icon: FileSearch, title: 'Get a clear estimate', description: "We'll follow up with a straightforward estimate before any work begins. No surprises." },
  { icon: Wrench, title: 'We diagnose and repair', description: 'On-site, drop-off, or remote — whichever fits the problem and your schedule.' },
  { icon: Smile, title: 'Get back to what matters', description: "We'll walk you through what we did and make sure everything works before we leave." },
];

const TRUST_SIGNALS = [
  { icon: ShieldCheck, title: 'Insured Business', description: 'Registered and insured — book with confidence.' },
  { icon: Lock, title: 'Secure Device Handling', description: 'Your devices and data are handled with care and confidentiality.' },
  { icon: Tag, title: 'Clear Pricing', description: 'You approve an estimate before any work begins. No hidden fees.' },
  { icon: BadgeCheck, title: 'Ownership Verification', description: 'We confirm device ownership before performing any repair.' },
  { icon: UserCheck, title: 'Privacy-First Service', description: 'We never access more of your data than a repair requires.' },
  { icon: MapPin, title: 'Local Support', description: 'Based in Fargo, North Dakota — real people, not a call center.' },
];

export default function TechRescuePage() {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techRescueLocalBusinessJsonLd()) }}
      />
      <Hero
        eyebrow="Tech Rescue"
        title="Technology problems, rescued."
        description="On-demand support for computers, phones, gaming devices, and the technology that keeps your home or business running."
        primaryAction={{ label: 'Start a Repair', href: '#booking' }}
        secondaryAction={{ label: `Call ${CONTACT.phoneDisplay}`, href: `tel:${CONTACT.phoneTel}` }}
      />

      <section className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            What We Fix
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            One team, every device.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.map((category) => (
            <ServiceCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Four steps to a fix.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-vybe text-white font-display font-bold text-sm">
                    {index + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Why VYBE
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Trust matters when it's your tech.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUST_SIGNALS.map((signal) => (
              <div
                key={signal.title}
                className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <signal.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg">{signal.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="border-t border-border/60 bg-card/30 py-20 md:py-28 scroll-mt-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 max-w-5xl mx-auto">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
                Start a Repair
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                Let's get your tech back on track.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Fill out the form and we'll follow up with a clear estimate — usually within one
                business day. Prefer to talk it through first?
              </p>
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
              >
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-6 md:p-8">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
