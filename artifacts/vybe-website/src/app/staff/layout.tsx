'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// ClerkProvider must never run during the static export build (SSR pass).
// Loading the client layout with ssr:false is the same pattern used on the
// staff pages and is the only way to guarantee no hydration mismatch.
const StaffLayoutClient = dynamic(() => import('./layout-client'), { ssr: false });

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <StaffLayoutClient>{children}</StaffLayoutClient>;
}
