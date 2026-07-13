import type { Metadata } from 'next';
import { PageViewReport } from '@/components/admin/page-view-report';

// Internal-only report — excluded from search engines (see robots.ts, which
// also disallows /admin/) and never linked from public pages.
export const metadata: Metadata = {
  title: 'Page View Report',
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return <PageViewReport />;
}
