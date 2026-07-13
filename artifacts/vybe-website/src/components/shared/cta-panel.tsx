import { ReactNode } from 'react';
import Link from 'next/link';

export function CtaPanel({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-gradient-vybe p-[1px] ${className}`}
    >
      <div className="relative rounded-3xl bg-background px-8 py-16 md:px-16 md:py-20 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 bg-gradient-vybe blur-3xl"
        />
        <div className="relative">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 max-w-2xl mx-auto">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">{description}</p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryAction.href}
              className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium glow-primary hover:opacity-90 transition-opacity"
            >
              {primaryAction.label}
            </Link>
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
