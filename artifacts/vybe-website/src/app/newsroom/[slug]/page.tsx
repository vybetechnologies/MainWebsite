import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { ArrowLeft } from 'lucide-react';
import { CtaPanel } from '@/components/shared/cta-panel';
import { urlForImage } from '@/lib/sanity/image';
import { getNewsArticleBySlug, getNewsArticleSlugs } from '@/lib/sanity/queries';
import { NEWS_CATEGORY_LABELS } from '@/lib/sanity/types';
import { formatArticleDateLong } from '@/lib/sanity/format-date';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const slugs = await getNewsArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return {};
  const image = article.mainImage ? urlForImage(article.mainImage).width(1200).height(630).url() : undefined;
  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/newsroom/${slug}`,
    type: 'article',
    ...(image ? { image } : {}),
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const imageUrl = article.mainImage ? urlForImage(article.mainImage).width(1600).height(900).url() : null;

  return (
    <article className="flex flex-col pb-24">
      <div className="container mx-auto px-6 pt-16 md:px-12">
        <Link
          href="/newsroom"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Newsroom
        </Link>

        <header className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide text-primary">
              {NEWS_CATEGORY_LABELS[article.category]}
            </span>
            <span>·</span>
            <time dateTime={article.publishedAt}>{formatArticleDateLong(article.publishedAt)}</time>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.summary}</p>
        </header>

        {imageUrl && (
          <div className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={imageUrl}
              alt={(article.mainImage.alt as string) || article.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </div>
        )}

        <div className="prose prose-invert mx-auto mt-10 max-w-3xl prose-headings:font-display prose-a:text-primary">
          <PortableText value={article.body} />
        </div>
      </div>

      <div className="container mx-auto px-6 pt-20 md:px-12">
        <CtaPanel
          eyebrow="Let's Connect"
          title="Have a story lead or press question?"
          description="Our team is reachable directly for media and partnership inquiries."
          primaryAction={{ label: 'Contact VYBE', href: '/contact' }}
          secondaryAction={{ label: 'View Newsroom', href: '/newsroom' }}
        />
      </div>
    </article>
  );
}
