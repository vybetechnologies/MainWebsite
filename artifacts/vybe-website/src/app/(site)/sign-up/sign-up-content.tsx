'use client';

import { SignUp, ClerkLoading, ClerkLoaded } from '@clerk/react';
import Link from 'next/link';

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function SignUpContent() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 gap-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block font-display font-bold text-2xl tracking-wide text-gradient">
          VYBE
        </Link>
        <p className="text-sm text-muted-foreground">Create your account</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Personal or business — you can add an organization after sign-up.
        </p>
      </div>

      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>
        <SignUp
          routing="hash"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/account"
        />
      </ClerkLoaded>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account you agree to the{' '}
        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
