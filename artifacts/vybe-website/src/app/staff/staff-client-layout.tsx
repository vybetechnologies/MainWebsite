'use client';

// This component exists solely to cross the Server→Client boundary so that
// the dynamic import below (which requires a 'use client' context) is allowed.
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const ClerkShell = dynamic(() => import('./clerk-shell'), { ssr: false });

export default function StaffClientLayout({ children }: { children: ReactNode }) {
  return <ClerkShell>{children}</ClerkShell>;
}
