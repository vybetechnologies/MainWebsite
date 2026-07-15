'use client';

// `next/dynamic({ ssr: false })` triggers Next.js's BailoutToCSR internally, which
// throws during client-side navigation in React 19 and crashes the page.
// A useState/useEffect mount gate avoids the throw entirely: it returns an empty
// placeholder during the static-export prerender pass and swaps to the real
// ClerkShell on the client after mount, with no thrown error.
import { ReactNode, useState, useEffect } from 'react';
import ClerkShell from './clerk-shell';

export default function StaffClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Empty shell during prerender keeps ClerkProvider away from the SSR pass.
  // ClerkProvider accesses browser APIs and must only run in the browser.
  if (!mounted) return <div className="flex min-h-[60vh] flex-col" />;
  return <ClerkShell>{children}</ClerkShell>;
}
