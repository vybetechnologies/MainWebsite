'use client';

import { useState, useEffect } from 'react';
import SignInContent from './sign-in-content';

export default function SignInPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <SignInContent />;
}
