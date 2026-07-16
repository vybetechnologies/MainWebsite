'use client';

import {
  useOrganization,
  useOrganizationList,
  CreateOrganization,
  OrganizationProfile,
} from '@clerk/react';
import { Building2, Plus, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// ── No org state ──────────────────────────────────────────────────────────────

function NoOrgState() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">My Organization</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a business account to collaborate with your team and manage services together.
        </p>
      </div>

      {showCreate ? (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <CreateOrganization
            afterCreateOrganizationUrl="/account/organization"
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full !rounded-none !border-0 !shadow-none bg-transparent',
                card: '!bg-transparent !shadow-none !border-0',
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                formFieldInput: 'bg-[hsl(240,20%,16%)] border-white/10 text-foreground',
              },
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Explainer */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Building2,
                title: 'Business profile',
                desc: 'Represent your company or agency with a dedicated profile.',
              },
              {
                icon: Users,
                title: 'Team collaboration',
                desc: 'Invite colleagues and manage who has access to your account.',
              },
              {
                icon: ArrowRight,
                title: 'Shared services',
                desc: 'Track repair bookings and applications under one org.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-card p-5 space-y-2"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus size={15} />
            Create organization
          </button>
        </div>
      )}
    </div>
  );
}

// ── Has org state ─────────────────────────────────────────────────────────────

function HasOrgState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">My Organization</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your business profile, members, and settings.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full !rounded-none !border-0 !shadow-none bg-transparent',
              card: '!bg-transparent !shadow-none !border-0',
              navbar: 'border-r border-white/10 bg-card/20',
              navbarButton: 'text-muted-foreground hover:text-foreground hover:bg-white/5',
              navbarButtonActive: 'bg-primary/15 text-primary',
              pageScrollBox: 'p-6',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
              formFieldInput: 'bg-[hsl(240,20%,16%)] border-white/10 text-foreground',
              badge: 'bg-primary/15 text-primary',
              tableHead: 'text-muted-foreground text-xs',
              membersPageInviteButton: 'bg-primary hover:bg-primary/90 text-primary-foreground text-sm',
            },
          }}
        />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function OrgContent() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-card animate-pulse" />
        <div className="h-48 rounded-2xl bg-card animate-pulse" />
      </div>
    );
  }

  return organization ? <HasOrgState /> : <NoOrgState />;
}
