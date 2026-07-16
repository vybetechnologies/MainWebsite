'use client';

// Mount gate — keeps ClerkProvider away from the static-export prerender pass.
// Identical pattern to staff/staff-client-layout.tsx.
import { ReactNode, useState, useEffect } from 'react';
import CustomerClerkShell from './customer-clerk-shell';

export default function CustomerClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Return an invisible placeholder during prerender so the DOM shape matches.
  if (!mounted) return <>{children}</>;
  return <CustomerClerkShell>{children}</CustomerClerkShell>;
}
