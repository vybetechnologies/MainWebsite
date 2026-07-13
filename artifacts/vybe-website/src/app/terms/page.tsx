import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/shared/coming-soon-page';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'VYBE Technologies terms of service.',
};

export default function TermsPage() {
  return (
    <ComingSoonPage
      eyebrow="Legal"
      title="Our terms of service are being finalized."
      description="Published terms of service are on their way as part of our legal & compliance rollout."
    />
  );
}
