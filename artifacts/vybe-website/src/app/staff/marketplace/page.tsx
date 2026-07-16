'use client';

import { StaffAuthGate } from '@/app/staff/staff-shell';
import MarketplaceContent from './marketplace-content';

export default function StaffMarketplacePage() {
  return (
    <StaffAuthGate>
      <MarketplaceContent />
    </StaffAuthGate>
  );
}
