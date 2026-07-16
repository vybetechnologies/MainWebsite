'use client';

import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/react';
import Link from 'next/link';

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function SignInContent() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 gap-6">
      <div className="text-center space-y-1">
        <Link href="/" className="inline-block font-display font-bold text-2xl tracking-wide text-gradient">
          VYBE
        </Link>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn
          routing="hash"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/account"
        />
      </ClerkLoaded>

      <p className="text-center text-xs text-muted-foreground">
        By signing in you agree to the{' '}
        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
