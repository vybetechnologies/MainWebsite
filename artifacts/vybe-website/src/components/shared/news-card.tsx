import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function NewsCard({
  category,
  date,
  title,
  summary,
  href,
}: {
  category: string;
  date: string;
  title: string;
  summary: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6 hover:border-primary/40 transition-colors"
    >
      <div className="aspect-video rounded-xl bg-gradient-vybe opacity-80" aria-hidden />
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-wide text-primary">{category}</span>
        <span>·</span>
        <time>{date}</time>
      </div>
      <h3 className="font-display font-semibold text-lg leading-snug">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{summary}</p>
      <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Read more <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
