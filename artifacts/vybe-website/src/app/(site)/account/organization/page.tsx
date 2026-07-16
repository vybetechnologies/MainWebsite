'use client';

import { useState, useEffect } from 'react';
import OrgContent from './org-content';

export default function OrganizationPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <OrgContent />;
}
