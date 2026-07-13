export type NewsCategory =
  | 'press-release'
  | 'product-announcement'
  | 'company-news'
  | 'community-initiative';

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  'press-release': 'Press Release',
  'product-announcement': 'Product Announcement',
  'company-news': 'Company News',
  'community-initiative': 'Community Initiative',
};

export interface SanityImage {
  asset?: { _ref: string; _id?: string };
  [key: string]: unknown;
}

export interface NewsArticleSummary {
  _id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  publishedAt: string;
  summary: string;
  mainImage: SanityImage & { alt?: string };
}

export interface PortableTextBlock {
  _type: string;
  [key: string]: unknown;
}

export interface NewsArticle extends NewsArticleSummary {
  body: PortableTextBlock[];
}
