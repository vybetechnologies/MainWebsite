'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Same pattern as contact-page-dynamic.tsx — see that file for rationale.
const CareersInterestForm = dynamic(
  () => import('./interest-form').then((m) => ({ default: m.CareersInterestForm })),
  { ssr: false, loading: () => null },
);

export function CareersInterestFormDynamic() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-32 animate-pulse rounded-xl bg-card/50" />;
  return <CareersInterestForm />;
}
