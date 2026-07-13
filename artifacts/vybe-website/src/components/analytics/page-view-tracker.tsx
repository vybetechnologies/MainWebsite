'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Minimal, privacy-respecting page-view counter.
 *
 * - No cookies, no localStorage, no persistent identifiers of any kind.
 * - Sends only the current path — nothing that could identify a visitor.
 * - Uses `navigator.sendBeacon` so the request never blocks navigation and
 *   fails silently if the API is unreachable.
 *
 * Because no tracking cookies are set, this does not trigger a legal
 * requirement for a cookie-consent banner (see /privacy for details).
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const payload = JSON.stringify({ path: pathname });

    try {
      if (typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/pageview', blob);
      } else {
        void fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // Analytics must never break the site.
    }
  }, [pathname]);

  return null;
}
