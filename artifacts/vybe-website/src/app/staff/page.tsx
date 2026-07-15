'use client';

// Mount gate instead of next/dynamic({ ssr: false }) — see staff-client-layout.tsx.
import { useState, useEffect } from 'react';
import DashboardContent from './dashboard-content';

export default function StaffDashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <DashboardContent />;
}
