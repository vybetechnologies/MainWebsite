import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/shared/coming-soon-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'VYBE Technologies privacy policy.',
};

export default function PrivacyPage() {
  return (
    <ComingSoonPage
      eyebrow="Legal"
      title="Our privacy policy is being finalized."
      description="A full, published privacy policy is on its way as part of our legal & compliance rollout."
    />
  );
}
