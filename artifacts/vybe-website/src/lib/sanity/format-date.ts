export function formatArticleDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', options ?? { month: 'long', year: 'numeric' });
}

export function formatArticleDateLong(iso: string): string {
  return formatArticleDate(iso, { month: 'long', day: 'numeric', year: 'numeric' });
}
