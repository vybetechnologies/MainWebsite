import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/shared/coming-soon-page';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about VYBE Technologies, headquartered in Fargo, North Dakota.',
};

export default function AboutPage() {
  return (
    <ComingSoonPage
      eyebrow="About VYBE"
      title="Our story is still being written here."
      description="The full About page is on its way. Reach out if you'd like to know more about our team and mission today."
    />
  );
}
