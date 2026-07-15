---
name: Next.js 15 + React 19 static export — React Query hooks in public forms
description: Why next/dynamic(ssr:false) + React Query hooks causes client crashes on static-export sites, and the correct pattern.
---

# Next.js 15 + React 19 static-export: React Query hooks in public `'use client'` components

## The Rule
Never call React Query hooks (`useMutation`, `useQuery`) inside `'use client'` components that need to render on public pages of a static-export Next.js 15 site. Use the plain generated API functions instead.

## Why
- `useMutation` / `useQuery` require `QueryClientProvider` in context.
- During static export pre-rendering, if the component renders without the QueryClient (even wrapped in `next/dynamic({ ssr: false })`), it throws "No QueryClient set".
- `next/dynamic({ ssr: false })` wraps the lazy component in `BailoutToCSR` + `Suspense` in Next.js 15. In React 19, this combination causes client-side crashes (the "Application error" screen) when the lazy chunk resolves — the exact error is still unclear, but all three approaches tried (plain next/dynamic, mount gate, combined mount gate + next/dynamic) crashed in production.
- The mount gate + next/dynamic DID prevent the SSR error, but still crashed in the browser.

## How to Apply
Use the plain (non-hook) API function in form submit handlers:
```tsx
// ❌ Don't do this in public-page form components
import { useCreateBookingRequest } from '@workspace/api-client-react';
const mutation = useCreateBookingRequest();
await mutation.mutateAsync({ data: { ... } });

// ✅ Do this instead
import { createBookingRequest, setBaseUrl } from '@workspace/api-client-react';
import { resolveApiBaseUrl } from '@/lib/api-base';
// in submit handler:
setBaseUrl(resolveApiBaseUrl(window.location.hostname));
await createBookingRequest({ ... });
```

This pattern:
1. Eliminates `QueryClientProvider` dependency from the form component
2. Allows the component to render as a plain `'use client'` component without `next/dynamic` wrappers
3. Resolves the API base URL at submit time (safe — setBaseUrl is idempotent)
4. Pages pre-render fully server-side → zero hydration mismatch risk

**Why:** React Query hooks + `next/dynamic(ssr:false)` + React 19 static export = client crash in production. Three fix attempts all failed. Removing the hook dependency fixed it.
