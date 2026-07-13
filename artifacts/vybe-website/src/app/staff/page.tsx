'use client';

import dynamic from 'next/dynamic';

// Clerk's React SDK requires a browser environment (ClerkProvider only
// initializes client-side — see staff/layout.tsx). With `output: 'export'`,
// Next still prerenders every page on the server at build time, so this
// content must be loaded with `ssr: false` to skip that pass entirely.
const DashboardContent = dynamic(() => import('./dashboard-content'), { ssr: false });

export default function StaffDashboardPage() {
  return <DashboardContent />;
}
