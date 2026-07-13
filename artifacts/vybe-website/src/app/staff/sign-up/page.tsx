'use client';

import dynamic from 'next/dynamic';

// See staff/page.tsx — Clerk components must skip server prerendering.
const SignUpContent = dynamic(() => import('./sign-up-content'), { ssr: false });

export default function StaffSignUpPage() {
  return <SignUpContent />;
}
