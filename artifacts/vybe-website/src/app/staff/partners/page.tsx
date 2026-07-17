import { StaffAuthGate } from '@/app/staff/staff-shell';
import PartnersContent from './partners-content';

export default function StaffPartnersPage() {
  return (
    <StaffAuthGate>
      <PartnersContent />
    </StaffAuthGate>
  );
}
