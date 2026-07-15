'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// ContactPageContent uses React Query hooks — client-only.
//
// Pattern: mount gate (useState/useEffect) + next/dynamic
// - The mount gate ensures server and client render the SAME placeholder div
//   during React 19 hydration, preventing the Suspense-boundary mismatch that
//   next/dynamic(ssr:false) alone causes in Next.js 15 + React 19 static exports.
// - The dynamic import keeps BookingForm in a separate lazy chunk so it never
//   runs at module-load time (avoids static-import crash on eager bundle eval).
const ContactPageContent = dynamic(
  () => import('./contact-page-content').then((m) => ({ default: m.ContactPageContent })),
  { ssr: false, loading: () => null },
);

export function ContactPageDynamic() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-[60vh]" />;
  return <ContactPageContent />;
}
