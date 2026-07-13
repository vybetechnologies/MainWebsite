import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/shared/coming-soon-page';

export const metadata: Metadata = {
  title: 'Newsroom',
  description: 'News and updates from VYBE Technologies.',
};

export default function NewsroomPage() {
  return (
    <ComingSoonPage
      eyebrow="Newsroom"
      title="Our newsroom is coming online soon."
      description="Company news, announcements, and updates will live here once our CMS integration ships."
    />
  );
}
