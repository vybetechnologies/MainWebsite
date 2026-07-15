'use client';

// Mount gate instead of next/dynamic({ ssr: false }) — see staff-client-layout.tsx.
import { useState, useEffect } from 'react';
import SignInContent from './sign-in-content';

export default function StaffSignInPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <SignInContent />;
}
