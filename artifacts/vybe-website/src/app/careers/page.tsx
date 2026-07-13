import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/shared/coming-soon-page';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Careers and open roles at VYBE Technologies.',
};

export default function CareersPage() {
  return (
    <ComingSoonPage
      eyebrow="Careers"
      title="We're building our careers page."
      description="Open roles will be posted here soon. Interested in joining VYBE early? Reach out directly."
    />
  );
}
