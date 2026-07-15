// Server Component — no 'use client'.
// ClerkProvider must never render during the SSR/static-export pass because it
// accesses browser APIs and produces a different DOM than the client, which
// triggers React's hydration error.  The solution: delegate to a 'use client'
// wrapper that uses next/dynamic({ ssr: false }) to load ClerkProvider
// exclusively in the browser.  next/dynamic with ssr:false is only allowed
// inside 'use client' components, not server components, so the server
// component's only job is to bridge the boundary.
import { ReactNode } from 'react';
import StaffClientLayout from './staff-client-layout';

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <StaffClientLayout>{children}</StaffClientLayout>;
}
