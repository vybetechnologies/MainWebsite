'use client';

import { useState, useEffect } from 'react';
import CareersContent from './careers-content';

export default function StaffCareersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <CareersContent />;
}
