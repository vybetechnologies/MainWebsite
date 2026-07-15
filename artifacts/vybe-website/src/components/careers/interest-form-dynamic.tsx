'use client';

import { useState, useEffect } from 'react';
import { CareersInterestForm } from './interest-form';

// Same pattern as contact-page-dynamic.tsx — see that file for rationale.
export function CareersInterestFormDynamic() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-32 animate-pulse rounded-xl bg-card/50" />;
  return <CareersInterestForm />;
}
