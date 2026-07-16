'use client';

import { ReactNode, useEffect } from 'react';
import { setBaseUrl } from '@workspace/api-client-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { CartProvider } from '@/lib/cart-context';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    setBaseUrl(resolveApiBaseUrl(window.location.hostname));
  }, []);

  return (
    <CartProvider>
      <TooltipProvider>
        {children}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </CartProvider>
  );
}
