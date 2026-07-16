'use client';

import { useState, useEffect } from 'react';
import RepairsContent from './repairs-content';

export default function RepairsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <RepairsContent />;
}
