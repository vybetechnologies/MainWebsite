'use client';

import { useState, useEffect } from 'react';
import { ContactPageContent } from './contact-page-content';

// ContactPageContent uses React Query hooks which require a browser environment.
// The useState/useEffect mount gate ensures server and client both render the
// same placeholder div on first pass, eliminating React 19's hydration mismatch
// that next/dynamic({ ssr: false }) triggers via its internal Suspense boundary.
export function ContactPageDynamic() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-[60vh]" />;
  return <ContactPageContent />;
}
