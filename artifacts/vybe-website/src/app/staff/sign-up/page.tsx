'use client';

import { SignUp } from '@clerk/react';

export default function StaffSignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <SignUp routing="hash" signInUrl="/staff/sign-in" fallbackRedirectUrl="/staff/" />
    </div>
  );
}
