'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Building2, Wrench, FileText, ShoppingCart, LogOut, ChevronRight } from 'lucide-react';
import { useUser, useClerk, Show } from '@clerk/react';
import { useCart } from '@/lib/cart-context';

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV = [
  { href: '/account', label: 'Profile', icon: User, exact: true },
  { href: '/account/organization', label: 'My Organization', icon: Building2, exact: false },
  { href: '/account/repairs', label: 'My Repairs', icon: Wrench, exact: false },
  { href: '/account/applications', label: 'My Applications', icon: FileText, exact: false },
  { href: '/cart', label: 'Cart', icon: ShoppingCart, exact: false },
];

// ── Mobile tab bar ────────────────────────────────────────────────────────────

function MobileTabs() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden flex border-b border-white/10 overflow-x-auto gap-1 px-4 bg-card/40">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={13} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// ── Sidebar (only rendered inside SignedIn, so useUser is safe) ───────────────

function AccountSidebarInner() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { cartCount } = useCart();

  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Your account';
  const avatar = user?.imageUrl;
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-card/30 min-h-full">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            {user?.primaryEmailAddress?.emailAddress && (
              <p className="text-xs text-muted-foreground truncate">
                {user.primaryEmailAddress.emailAddress}
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          const isCart = href === '/cart';
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              {isCart && cartCount > 0 && (
                <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: '/' })}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ── Auth-aware shell (uses Show from Clerk, safe with mount gate) ─────────────

function AccountShellInner({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      <Show when="signed-out">
        <div className="flex flex-col items-center justify-center gap-6 py-32 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">Sign in to access your account</h1>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              Manage your profile, track repairs, and view your applications all in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
          <AccountSidebarInner />
          <div className="flex-1 min-w-0">
            <MobileTabs />
            <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-4xl">
              {children}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

// ── Exported layout — mount gate prevents Clerk calls during prerender ─────────

export default function AccountClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    // During prerender / before hydration: show a neutral skeleton
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return <AccountShellInner>{children}</AccountShellInner>;
}
