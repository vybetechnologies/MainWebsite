export function MetricCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 text-center">
      <p className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
