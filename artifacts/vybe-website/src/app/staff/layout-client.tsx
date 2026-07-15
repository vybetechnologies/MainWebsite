'use client';

import { ReactNode, useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { CLERK_PUBLISHABLE_KEY } from '@/lib/clerk-config';

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: '/staff/',
    logoImageUrl: '/vybe-logo-transparent.png',
  },
  variables: {
    colorPrimary: 'hsl(262 83% 62%)',
    colorForeground: 'hsl(210 30% 97%)',
    colorMutedForeground: 'hsl(220 15% 65%)',
    colorDanger: 'hsl(0 84% 60%)',
    colorBackground: 'hsl(240 18% 13%)',
    colorInput: 'hsl(240 20% 16%)',
    colorInputForeground: 'hsl(210 30% 97%)',
    colorNeutral: 'hsl(240 20% 16%)',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[hsl(240,18%,13%)] rounded-2xl w-[440px] max-w-full overflow-hidden border border-white/10',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButtonText: 'text-foreground',
    formFieldLabel: 'text-foreground',
    footerActionLink: 'text-primary',
    footerActionText: 'text-muted-foreground',
    dividerText: 'text-muted-foreground',
    identityPreviewEditButton: 'text-primary',
    formFieldSuccessText: 'text-foreground',
    alertText: 'text-foreground',
    logoBox: 'mb-2',
    logoImage: 'h-8 w-auto',
    socialButtonsBlockButton: 'border border-white/10',
    formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    formFieldInput: 'bg-[hsl(240,20%,16%)] border-white/10 text-foreground',
    footerAction: 'text-muted-foreground',
    dividerLine: 'bg-white/10',
    alert: 'bg-[hsl(240,20%,16%)] border-white/10',
    otpCodeFieldInput: 'bg-[hsl(240,20%,16%)] border-white/10 text-foreground',
    formFieldRow: '',
    main: '',
  },
};

function AuthBridge() {
  const { isSignedIn, getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(isSignedIn ? () => getToken() : null);
    return () => setAuthTokenGetter(null);
  }, [isSignedIn, getToken]);
  return null;
}

// This component is only ever rendered on the client (imported via next/dynamic
// with ssr:false from layout.tsx), so ClerkProvider never runs during the static
// export build pass and there is no hydration mismatch.
export default function StaffLayoutClient({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      signInUrl="/staff/sign-in"
      signUpUrl="/staff/sign-up"
    >
      <AuthBridge />
      <div className="flex min-h-[60vh] flex-col">{children}</div>
    </ClerkProvider>
  );
}
