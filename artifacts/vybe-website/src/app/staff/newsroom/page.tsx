import { StaffAuthGate } from '@/app/staff/staff-shell';
import NewsroomContent from './newsroom-content';

export default function StaffNewsroomPage() {
  return (
    <StaffAuthGate>
      <NewsroomContent />
    </StaffAuthGate>
  );
}
