'use client';

import { useUser, useOrganizationList, UserProfile } from '@clerk/react';
import { Building2, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// ── Org switcher pill ─────────────────────────────────────────────────────────

function OrgSwitcher() {
  const { userMemberships, isLoaded } = useOrganizationList({ userMemberships: true });
  const [open, setOpen] = useState(false);

  if (!isLoaded) return null;

  const memberships = userMemberships?.data ?? [];

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-base">Organization</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Switch between personal and business accounts
          </p>
        </div>
        <Link
          href="/account/organization"
          className="text-xs text-primary hover:underline"
        >
          Manage
        </Link>
      </div>

      {memberships.length === 0 ? (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-white/15 px-4 py-3">
          <p className="text-sm text-muted-foreground">No organization yet</p>
          <Link
            href="/account/organization"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Plus size={12} />
            Create one
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {memberships.map((m) => (
            <div
              key={m.organization.id}
              className="flex items-center gap-3 rounded-lg bg-card/60 border border-white/8 px-4 py-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                {m.organization.imageUrl ? (
                  <img src={m.organization.imageUrl} alt={m.organization.name} className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <Building2 size={14} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.organization.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{m.role.replace('org:', '')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Profile content ───────────────────────────────────────────────────────────

export default function ProfileContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* Org switcher above the Clerk UserProfile */}
      <OrgSwitcher />

      {/* Clerk UserProfile handles everything: name, email, avatar, password, connected accounts */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <UserProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full !rounded-none !border-0 !shadow-none bg-transparent',
              card: '!bg-transparent !shadow-none !border-0',
              navbar: 'border-r border-white/10 bg-card/20',
              navbarButton: 'text-muted-foreground hover:text-foreground hover:bg-white/5',
              navbarButtonActive: 'bg-primary/15 text-primary',
              pageScrollBox: 'p-6',
              profileSectionTitleText: 'text-foreground font-semibold text-sm',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
              formFieldInput: 'bg-[hsl(240,20%,16%)] border-white/10 text-foreground',
              badge: 'bg-primary/15 text-primary',
            },
          }}
        />
      </div>
    </div>
  );
}
