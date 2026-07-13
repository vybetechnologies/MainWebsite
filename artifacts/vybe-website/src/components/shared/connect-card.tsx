import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

export function ConnectCard({
  icon: Icon,
  title,
  description,
  cta,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="group relative flex flex-col gap-5 rounded-2xl border border-card-border bg-card p-7 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_50px_-15px_hsl(var(--primary)/0.35)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-vybe">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
