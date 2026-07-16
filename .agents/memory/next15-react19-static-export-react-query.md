---
name: Next.js 15 + React 19 static export — next/dynamic(ssr:false) crashes on client-side navigation
description: Why next/dynamic(ssr:false) crashes on client-side navigation in React 19, and the correct mount-gate pattern to use instead.
---

# Next.js 15 + React 19 static-export: next/dynamic(ssr:false) crashes on client-side navigation

## The Rule
Never use `next/dynamic({ ssr: false })` on a static-export Next.js 15 site with React 19. Replace every occurrence with a `useState/useEffect` mount gate + static import.

## Why
`next/dynamic({ ssr: false })` uses Next.js's internal `BailoutToCSR` mechanism, which **throws** during client-side navigation in React 19. This throw propagates to the error boundary and produces the "Application error: a client-side exception has occurred" black screen. Full-page loads (URL bar) work fine because the static HTML is served first — the crash only happens when navigating via a Next.js `<Link>`.

## How to Apply
Replace every `next/dynamic(ssr:false)` with a mount gate:

```tsx
// ❌ Crashes on client-side navigation in React 19
const ClerkShell = dynamic(() => import('./clerk-shell'), { ssr: false });
export default function Layout({ children }) {
  return <ClerkShell>{children}</ClerkShell>;
}

// ✅ Mount gate — no throw, no crash
import ClerkShell from './clerk-shell'; // static import
export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="flex min-h-[60vh] flex-col" />;
  return <ClerkShell>{children}</ClerkShell>;
}
```

The mount gate returns a placeholder during static-export prerender (no throw), then renders the real component after hydration on the client. React 19 may log a hydration mismatch warning but does NOT crash.

## React Query hook variant
If the component also uses a React Query hook (`useMutation`, `useQuery`) that requires `QueryClientProvider`, the mount gate alone is not sufficient — the hook is called unconditionally at the top of the component before any early return. In that case, replace the hook with the plain generated API function and call `setBaseUrl(resolveApiBaseUrl(window.location.hostname))` at submit time.

## Affected areas on vybetechnologies.net
- `staff-client-layout.tsx` — Clerk shell wrapper
- `staff/page.tsx` — dashboard content
- `staff/sign-in/page.tsx` — sign-in form
- `staff/sign-up/page.tsx` — sign-up form
- All public form pages (contact, tech-rescue, careers) — fixed by removing React Query hooks entirely

**Why:** Confirmed through production crashes. Full-page loads worked; crashes only occurred on client-side Link navigation.
