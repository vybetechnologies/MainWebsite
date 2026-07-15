'use client';

// Mount gate instead of next/dynamic({ ssr: false }) — see staff-client-layout.tsx.
import { useState, useEffect } from 'react';
import SignUpContent from './sign-up-content';

export default function StaffSignUpPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <SignUpContent />;
}
