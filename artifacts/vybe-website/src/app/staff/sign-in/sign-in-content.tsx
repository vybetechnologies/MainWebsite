'use client';

import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/react';

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading sign-in…</p>
    </div>
  );
}

export default function StaffSignInContent() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn routing="hash" signUpUrl="/staff/sign-up" fallbackRedirectUrl="/staff/" />
      </ClerkLoaded>
    </div>
  );
}
