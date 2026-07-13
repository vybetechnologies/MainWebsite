import { LucideIcon } from 'lucide-react';

export function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6 hover:border-secondary/40 transition-colors">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20">
        <Icon className="h-5 w-5 text-secondary" />
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
