import { Heart, Rocket, ShieldCheck, GraduationCap, HeartPulse, CalendarClock } from 'lucide-react';
import { Hero } from '@/components/shared/hero';
import { ServiceCard } from '@/components/shared/service-card';
import { CareersInterestFormDynamic } from '@/components/careers/interest-form-dynamic';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Careers',
  description: 'Careers, culture, and open roles at VYBE Technologies in Fargo, North Dakota.',
  path: '/careers',
});

const PRINCIPLES = [
  { icon: Heart, title: 'People First', description: 'We treat teammates the way we ask them to treat customers.' },
  { icon: Rocket, title: 'Build Boldly', description: 'You will ship real work quickly, with ownership over outcomes.' },
  { icon: ShieldCheck, title: 'Earn Trust', description: 'Do what you say you will do, and say so when you cannot.' },
];

const BENEFITS = [
  { icon: HeartPulse, title: 'Health Coverage', description: 'Health benefits for eligible team members.' },
  { icon: CalendarClock, title: 'Flexible Schedules', description: 'Work structured around real life, not the other way around.' },
  { icon: GraduationCap, title: 'Growth Support', description: 'Room to learn new skills and grow into new responsibilities.' },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      <Hero
        eyebrow="Careers"
        title={
          <>
            Build technology that <span className="text-gradient">people actually feel.</span>
          </>
        }
        description="VYBE Technologies is a small, fast-moving team based in Fargo, North Dakota. We're looking for people who care about doing good work and treating people well."
      />

      <section className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Our Culture
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Small team, real ownership.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Everyone at VYBE works close to the customer — whether that's a family fixing their
            first computer or a business rolling out managed IT. We move quickly, communicate
            directly, and expect everyone to bring their full effort and their full self to the
            work.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRINCIPLES.map((principle) => (
            <ServiceCard key={principle.title} {...principle} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Benefits
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              What we offer our team.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit) => (
              <ServiceCard key={benefit.title} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Current Openings
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">Open Roles</h2>
        </div>
        <div className="rounded-2xl border border-card-border bg-card p-10 text-center max-w-2xl">
          <p className="text-lg text-muted-foreground">
            There are no open roles right now, but we are always interested in meeting talented
            people.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 pb-24">
        <div className="max-w-2xl mx-auto rounded-3xl border border-card-border bg-card p-8 md:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Stay on Our Radar
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Introduce yourself.
            </h2>
            <p className="text-muted-foreground mt-3">
              Send us your background and what kind of work excites you — we'll reach out when a
              fit opens up.
            </p>
          </div>
          <CareersInterestFormDynamic />
        </div>
      </section>
    </div>
  );
}
