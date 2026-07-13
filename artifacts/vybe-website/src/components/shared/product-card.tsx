import Link from 'next/link';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { StatusBadge, type ProductStatus } from './status-badge';

export function ProductCard({
  icon: Icon,
  name,
  description,
  status,
  href,
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  status: ProductStatus;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-vybe">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <StatusBadge status={status} />
      </div>
      <div>
        <h3 className="font-display font-semibold text-lg mb-1.5">{name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Learn more <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
