'use client';

import dynamic from 'next/dynamic';

// CareersInterestForm uses React Query hooks — must be loaded client-side only.
const CareersInterestForm = dynamic(
  () => import('./interest-form').then((m) => ({ default: m.CareersInterestForm })),
  { ssr: false, loading: () => <div className="h-32 animate-pulse rounded-xl bg-card/50" /> },
);

export function CareersInterestFormDynamic() {
  return <CareersInterestForm />;
}
