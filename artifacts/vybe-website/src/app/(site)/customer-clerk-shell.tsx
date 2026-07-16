'use client';

// Mirrors staff/clerk-shell.tsx but for the public/customer side.
// Only ever runs in the browser (loaded via customer-client-layout.tsx mount gate).
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { CLERK_PUBLISHABLE_KEY } from '@/lib/clerk-config';

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: '/',
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
    cardBox:
      'bg-[hsl(240,18%,13%)] rounded-2xl w-[440px] max-w-full overflow-hidden border border-white/10',
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
    // UserProfile / OrganizationProfile embedded components
    profileSectionTitleText: 'text-foreground font-semibold',
    profileSectionContent: 'text-muted-foreground',
    navbarButtonIcon: 'text-muted-foreground',
    pageScrollBox: 'px-0',
  },
};

export default function CustomerClerkShell({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
