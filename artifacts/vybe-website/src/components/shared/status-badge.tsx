import { cn } from '@/lib/utils';

export type ProductStatus = 'available' | 'beta' | 'in-development' | 'coming-soon' | 'concept';

const STATUS_CONFIG: Record<ProductStatus, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  beta: {
    label: 'Beta',
    className: 'bg-secondary/10 text-secondary border-secondary/30',
  },
  'in-development': {
    label: 'In Development',
    className: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
  },
  'coming-soon': {
    label: 'Coming Soon',
    className: 'bg-primary/10 text-primary border-primary/30',
  },
  concept: {
    label: 'Concept',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
