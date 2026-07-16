'use client';

import { useState, useEffect } from 'react';
import ApplicationsContent from './applications-content';

export default function StaffApplicationsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <ApplicationsContent />;
}
