'use client';

// /catalog is now /shop — redirect automatically.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CatalogRedirectPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/shop'); }, [router]);
  return null;
}
