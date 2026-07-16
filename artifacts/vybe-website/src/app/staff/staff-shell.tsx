'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk, Show } from '@clerk/react';
import { LayoutDashboard, Inbox, BarChart2, LogOut, Briefcase, ClipboardList } from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────

export const VYBE_ORG_ID = 'org_3GYdwBU3lsknE6GICi5mlPVoRjD';

const NAV = [
  { href: '/staff', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/staff/submissions', label: 'Submissions', icon: Inbox, exact: false },
  { href: '/staff/careers', label: 'Careers', icon: Briefcase, exact: false },
  { href: '/staff/applications', label: 'Applications', icon: ClipboardList, exact: false },
  { href: '/staff/analytics', label: 'Analytics', icon: BarChart2, exact: false },
];

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useStaffAuth() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const isAuthorized =
    isLoaded &&
    !!user &&
    user.organizationMemberships.some(
      (m) => m.organization.id === VYBE_ORG_ID && m.role === 'org:admin',
    );

  return { user, isLoaded, isAuthorized, signOut };
}

// ── Sidebar shell ─────────────────────────────────────────────────────────────

function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useStaffAuth();

  const displayName =
    user?.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.primaryEmailAddress?.emailAddress ?? 'Staff');

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-white/10 bg-card/40">
      <div className="px-5 py-5 border-b border-white/10">
        <span className="font-display font-bold text-sm tracking-tight">
          VYBE <span className="text-primary">Staff</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
            {user?.primaryEmailAddress?.emailAddress && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.primaryEmailAddress.emailAddress}
              </p>
            )}
          </div>
          <button
            type="button"
            title="Sign out"
            onClick={() => signOut({ redirectUrl: '/staff/sign-in' })}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function StaffShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}

// ── Auth gate ─────────────────────────────────────────────────────────────────

/** Wraps every authenticated staff page. Shows sign-in / not-authorized states,
 *  then renders children inside the sidebar shell when the user is an org admin. */
export function StaffAuthGate({ children }: { children: ReactNode }) {
  const { isLoaded, isAuthorized, signOut } = useStaffAuth();

  return (
    <>
      <Show when="signed-out">
        <div className="flex flex-col items-center gap-4 py-32 text-center px-6">
          <h1 className="font-display text-2xl font-semibold">Staff sign-in required</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            This page is for authorized VYBE staff only.
          </p>
          <Link
            href="/staff/sign-in"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground text-sm"
          >
            Sign in
          </Link>
        </div>
      </Show>

      <Show when="signed-in">
        {!isLoaded ? (
          <div className="flex items-center justify-center py-32 text-muted-foreground text-sm">
            Loading…
          </div>
        ) : !isAuthorized ? (
          <div className="flex flex-col items-center gap-3 py-32 text-center px-6">
            <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              Your account isn&rsquo;t a VYBE org admin. Contact an administrator if this is a
              mistake.
            </p>
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: '/staff/sign-in' })}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        ) : (
          <StaffShell>{children}</StaffShell>
        )}
      </Show>
    </>
  );
}

// ── Shared UI primitives ──────────────────────────────────────────────────────

export function StaffPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-6 border-b border-white/10">
      <div>
        <h1 className="font-display text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card px-5 py-5 flex flex-col gap-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

/** Badge for submission service types. */
export function ServiceBadge({ service }: { service: string }) {
  const s = service.toLowerCase();
  const color = s.includes('tech') || s.includes('repair')
    ? 'bg-blue-500/15 text-blue-400'
    : s.includes('career') || s.includes('job')
    ? 'bg-green-500/15 text-green-400'
    : 'bg-purple-500/15 text-purple-400';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {service}
    </span>
  );
}
