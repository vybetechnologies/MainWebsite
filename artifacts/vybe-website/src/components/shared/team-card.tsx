export function TeamCard({
  name,
  role,
  bio,
}: {
  name: string;
  role: string;
  bio?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-vybe text-xl font-display font-bold text-white">
        {name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)}
      </div>
      <div>
        <h3 className="font-display font-semibold text-lg">{name}</h3>
        <p className="text-sm text-primary font-medium">{role}</p>
      </div>
      {bio && <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>}
    </div>
  );
}
