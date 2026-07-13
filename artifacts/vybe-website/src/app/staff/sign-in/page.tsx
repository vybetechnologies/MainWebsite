'use client';

import dynamic from 'next/dynamic';

// See staff/page.tsx — Clerk components must skip server prerendering.
const SignInContent = dynamic(() => import('./sign-in-content'), { ssr: false });

export default function StaffSignInPage() {
  return <SignInContent />;
}
