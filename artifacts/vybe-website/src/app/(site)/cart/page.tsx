'use client';

import { useState, useEffect } from 'react';
import CartContent from './cart-content';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <CartContent />;
}
