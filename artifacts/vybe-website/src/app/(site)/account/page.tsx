'use client';

import { useState, useEffect } from 'react';
import ProfileContent from './profile-content';

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <ProfileContent />;
}
