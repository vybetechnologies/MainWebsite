'use client';

import { useMemo, useState } from 'react';
import { NewsCard } from '@/components/shared/news-card';
import { urlForImage } from '@/lib/sanity/image';
import { NEWS_CATEGORY_LABELS, type NewsArticleSummary, type NewsCategory } from '@/lib/sanity/types';
import { formatArticleDate } from '@/lib/sanity/format-date';

const FILTERS: Array<{ value: 'all' | NewsCategory; label: string }> = [
  { value: 'all', label: 'All Updates' },
  { value: 'press-release', label: NEWS_CATEGORY_LABELS['press-release'] },
  { value: 'product-announcement', label: NEWS_CATEGORY_LABELS['product-announcement'] },
  { value: 'company-news', label: NEWS_CATEGORY_LABELS['company-news'] },
  { value: 'community-initiative', label: NEWS_CATEGORY_LABELS['community-initiative'] },
];

export function NewsroomFilter({ articles }: { articles: NewsArticleSummary[] }) {
  const [active, setActive] = useState<'all' | NewsCategory>('all');

  const filtered = useMemo(
    () => (active === 'all' ? articles : articles.filter((article) => article.category === active)),
    [articles, active],
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            aria-pressed={active === filter.value}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mx-auto max-w-md text-center text-muted-foreground">
          No articles in this category yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((article) => (
            <NewsCard
              key={article._id}
              category={NEWS_CATEGORY_LABELS[article.category]}
              date={formatArticleDate(article.publishedAt)}
              title={article.title}
              summary={article.summary}
              href={`/newsroom/${article.slug}`}
              imageUrl={article.mainImage ? urlForImage(article.mainImage).width(800).height(450).url() : undefined}
              imageAlt={article.mainImage?.alt as string | undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
