'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  visual,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  visual?: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-vybe opacity-20 blur-3xl"
      />
      <div className="container mx-auto px-6 md:px-12 py-32 relative grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {eyebrow && (
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-6">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.05] mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground max-w-lg mb-10">{description}</p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {primaryAction && (
                <Link
                  href={primaryAction.href}
                  className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium glow-primary hover:opacity-90 transition-opacity"
                >
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative hidden lg:block"
        >
          {visual ?? <DefaultHeroVisual />}
        </motion.div>
      </div>
    </section>
  );
}

function DefaultHeroVisual() {
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-vybe opacity-40 blur-2xl" />
      <div className="absolute inset-8 rounded-full border border-primary/30" />
      <div className="absolute inset-16 rounded-full border border-secondary/30" />
      <div className="absolute inset-24 rounded-full border border-accent-cyan/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-7xl font-bold text-gradient">V</span>
      </div>
    </div>
  );
}
