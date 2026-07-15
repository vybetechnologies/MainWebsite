'use client';

import dynamic from 'next/dynamic';

// ContactPageContent uses React Query hooks — must be loaded client-side only
// to avoid "No QueryClient set" errors during Next.js static export prerender.
const ContactPageContent = dynamic(
  () => import('./contact-page-content').then((m) => ({ default: m.ContactPageContent })),
  { ssr: false, loading: () => <div className="min-h-[60vh]" /> },
);

export function ContactPageDynamic() {
  return <ContactPageContent />;
}
