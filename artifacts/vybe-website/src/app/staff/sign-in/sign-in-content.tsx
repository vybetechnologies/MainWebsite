'use client';

import { SignIn } from '@clerk/react';

export default function StaffSignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <SignIn routing="hash" signUpUrl="/staff/sign-up" fallbackRedirectUrl="/staff/" />
    </div>
  );
}
