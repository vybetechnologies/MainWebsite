'use client';

import { useState, useEffect } from 'react';
import SignUpContent from './sign-up-content';

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <SignUpContent />;
}
