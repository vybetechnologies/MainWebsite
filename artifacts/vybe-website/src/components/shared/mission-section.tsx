import { Globe, MapPin, Lightbulb, Users } from 'lucide-react';

const NETWORK_NODES: [number, number, number][] = [
  [120, 220, 5],
  [260, 120, 3],
  [260, 320, 3],
  [420, 200, 6],
  [420, 80, 3],
  [420, 340, 3],
  [580, 140, 4],
  [580, 280, 4],
  [700, 200, 3],
];

const NETWORK_LINES: [number, number, number, number][] = [
  [120, 220, 260, 120],
  [120, 220, 260, 320],
  [260, 120, 420, 200],
  [260, 320, 420, 200],
  [420, 200, 420, 80],
  [420, 200, 420, 340],
  [420, 200, 580, 140],
  [420, 200, 580, 280],
  [580, 140, 700, 200],
  [580, 280, 700, 200],
];

function NetworkVisual() {
  return (
    <svg
      viewBox="0 0 800 400"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="netGlow" cx="15%" cy="55%" r="65%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#netGlow)" />
      {NETWORK_LINES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="hsl(var(--primary))"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      ))}
      {NETWORK_NODES.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="hsl(var(--accent-cyan))"
          opacity="0.7"
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

const MISSION_POINTS = [
  { icon: MapPin, label: 'Based in Fargo, North Dakota' },
  { icon: Globe, label: 'Built for global reach' },
  { icon: Lightbulb, label: 'Focused on practical innovation' },
  { icon: Users, label: 'Designed around people' },
];

export function MissionSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 opacity-50">
        <NetworkVisual />
      </div>
      <div className="container relative mx-auto grid items-center gap-16 px-6 md:px-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Our Mission
          </p>
          <h2 className="mb-6 max-w-lg font-display text-3xl font-bold md:text-5xl">
            Building a stronger technology future.
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            VYBE Technologies is committed to expanding access to technology, creating new
            digital opportunities, and helping build a stronger technology industry in North
            Dakota and beyond.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-6">
          {MISSION_POINTS.map((point) => (
            <li
              key={point.label}
              className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card/60 p-6 backdrop-blur-sm"
            >
              <point.icon className="h-5 w-5 text-accent-cyan" />
              <span className="text-sm font-medium">{point.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
