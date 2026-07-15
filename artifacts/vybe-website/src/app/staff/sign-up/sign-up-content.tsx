'use client';

import { SignUp, ClerkLoading, ClerkLoaded } from '@clerk/react';

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function StaffSignUpContent() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>
        <SignUp routing="hash" signInUrl="/staff/sign-in" fallbackRedirectUrl="/staff/" />
      </ClerkLoaded>
    </div>
  );
}
