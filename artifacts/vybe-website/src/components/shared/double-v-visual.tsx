'use client';

import { motion, useReducedMotion } from 'framer-motion';

const PARTICLES = [
  { top: '15%', left: '18%', duration: 4, delay: 0 },
  { top: '72%', left: '14%', duration: 5, delay: 0.5 },
  { top: '22%', left: '82%', duration: 4.5, delay: 1 },
  { top: '80%', left: '76%', duration: 6, delay: 1.5 },
  { top: '48%', left: '92%', duration: 5.5, delay: 0.8 },
  { top: '8%', left: '52%', duration: 5, delay: 1.2 },
];

/**
 * Abstract, animated double-V mark used as the hero visual. No stock
 * photography — two overlapping V polygons with glowing gradients, floating
 * particles, and a slow pulse. All motion is skipped when the user prefers
 * reduced motion.
 */
export function DoubleVVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative aspect-square max-w-lg mx-auto" aria-hidden>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-vybe opacity-30 blur-3xl"
        animate={
          shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-10 rounded-full border border-primary/20" />
      <div className="absolute inset-20 rounded-full border border-secondary/20" />

      {!shouldReduceMotion &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-accent-cyan/70"
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 200 140"
          className="w-3/5 h-3/5 drop-shadow-[0_0_30px_rgba(122,92,255,0.45)]"
        >
          <defs>
            <linearGradient id="vGradA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent-cyan))" />
            </linearGradient>
            <linearGradient id="vGradB" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
          <polygon points="10,10 55,10 100,110 92,130 55,55" fill="url(#vGradA)" opacity="0.92" />
          <polygon points="190,10 145,10 100,110 108,130 145,55" fill="url(#vGradB)" opacity="0.92" />
        </svg>
      </motion.div>
    </div>
  );
}
