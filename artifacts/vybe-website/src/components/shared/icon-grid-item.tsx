import { LucideIcon } from 'lucide-react';

export function IconGridItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-card-border bg-card p-6 text-center transition-colors hover:border-primary/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
