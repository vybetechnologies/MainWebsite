'use client';

import { ReactNode, useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { CLERK_PUBLISHABLE_KEY } from '@/lib/clerk-config';

// Use the external Clerk publishable key directly — do NOT use publishableKeyFromHost
// (a Replit-internal API) as it routes Clerk JS through Replit's proxy and ignores
// the configured external key.
const clerkPubKey =
  typeof window !== 'undefined' ? CLERK_PUBLISHABLE_KEY : undefined;

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: '/staff/',
    logoImageUrl: typeof window !== 'undefined' ? `${window.location.origin}/vybe-logo-transparent.png` : '',
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

export default function StaffLayout({ children }: { children: ReactNode }) {
  if (!clerkPubKey) {
    // SSR pass during static export — Clerk only initializes in the browser.
    return <div className="flex min-h-[60vh] items-center justify-center">{children}</div>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl="/staff/sign-in"
      signUpUrl="/staff/sign-up"
    >
      <AuthBridge />
      <div className="flex min-h-[60vh] flex-col">{children}</div>
    </ClerkProvider>
  );
}
