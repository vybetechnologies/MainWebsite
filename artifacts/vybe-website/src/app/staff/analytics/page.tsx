'use client';

// Mount gate — see staff-client-layout.tsx for why next/dynamic(ssr:false) is avoided.
import { useState, useEffect } from 'react';
import AnalyticsContent from './analytics-content';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <AnalyticsContent />;
}
