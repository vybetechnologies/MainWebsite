'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Phone, ShoppingCart, LogIn, UserPlus,
  ChevronDown, User, LogOut, Wrench, FileText, Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT } from '@/lib/contact-info';
import { useCart } from '@/lib/cart-context';

// ── Nav data ──────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  megaMenu?: { label: string; href: string; description?: string }[];
}

const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Solutions',
    href: '/solutions',
    megaMenu: [
      { label: 'For Individuals', href: '/solutions#individuals', description: 'Personal tech support & devices' },
      { label: 'For Businesses', href: '/solutions#businesses', description: 'Managed IT & security' },
      { label: 'For Communities', href: '/solutions#communities', description: 'Local partnerships & access' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    megaMenu: [
      { label: 'VYBE Circle', href: '/products#circle' },
      { label: 'VYBE Key', href: '/products#key' },
      { label: 'VYBE Mail', href: '/products#mail' },
      { label: 'VYBE Sound', href: '/products#sound' },
      { label: 'VYBE TV', href: '/products#tv' },
      { label: 'VYBE ID', href: '/products#id' },
      { label: 'VYBE HUB', href: '/products#hub' },
    ],
  },
  { label: 'Tech Rescue', href: '/tech-rescue' },
  { label: 'Shop', href: 'https://marketplace.vybetechnologies.net', external: true },
  { label: 'About', href: '/about' },
  { label: 'Partners', href: '/partners' },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

// ── Mega-menu link item ───────────────────────────────────────────────────────

function NavLinkItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [open, setOpen] = useState(false);

  if (!item.megaMenu) {
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium transition-colors hover:text-primary text-foreground/80"
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link
        href={item.href}
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive ? 'text-primary' : 'text-foreground/80'
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
          isActive ? 'text-primary' : 'text-foreground/80'
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 z-50"
          >
            <div className="glass-panel border border-border rounded-2xl p-3 shadow-xl">
              {item.megaMenu.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="block rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{sub.label}</p>
                  {sub.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{sub.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Cart button (no Clerk dependency) ────────────────────────────────────────

function NavCartButton({ mobile }: { mobile?: boolean }) {
  const { cartCount } = useCart();

  if (mobile) {
    return (
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
      className="relative text-foreground/70 hover:text-primary transition-colors"
    >
      <ShoppingCart className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );
}

// ── Auth section — Clerk-aware, only rendered after mount ─────────────────────
//
// The Navbar renders during the static-export prerender WITHOUT a ClerkProvider
// (CustomerClientLayout only wraps children in ClerkProvider after mount).
// Clerk hooks are imported at top-level (safe — imports don't call hooks),
// but they are only *called* inside NavAuthLive which is only *rendered*
// after the mount gate fires (when ClerkProvider is in the tree).
import { useUser, useClerk, Show } from '@clerk/react';

function NavAuthLive({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const avatar = user?.imageUrl;
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? '?';

  if (mobile) {
    return (
      <>
        <Show when="signed-out">
          <Link
            href="/sign-in"
            onClick={onClose}
            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-sm font-medium">Log In</span>
          </Link>
          <Link
            href="/sign-up"
            onClick={onClose}
            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Up</span>
          </Link>
        </Show>
        <Show when="signed-in">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
          >
            {avatar ? (
              <img src={avatar} alt="Account" className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                {initials}
              </div>
            )}
            <span className="text-sm font-medium">My Account</span>
          </Link>
          <button
            type="button"
            onClick={() => { signOut({ redirectUrl: '/' }); onClose?.(); }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </Show>
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Log In
        </Link>
        <Link
          href="/sign-up"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Link>
      </Show>

      <Show when="signed-in">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Account menu"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-primary/30 hover:border-primary transition-colors"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/30 hover:border-primary flex items-center justify-center text-primary text-xs font-bold transition-colors">
                {initials}
              </div>
            )}
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-3 w-52 z-50"
              >
                <div className="glass-panel border border-border rounded-2xl py-2 shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/8">
                    <p className="text-xs font-semibold truncate">
                      {user?.fullName ?? 'Your account'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {user?.primaryEmailAddress?.emailAddress ?? ''}
                    </p>
                  </div>

                  {[
                    { href: '/account', icon: User, label: 'Profile' },
                    { href: '/account/organization', icon: Building2, label: 'My Organization' },
                    { href: '/account/repairs', icon: Wrench, label: 'My Repairs' },
                    { href: '/account/applications', icon: FileText, label: 'My Applications' },
                    { href: '/cart', icon: ShoppingCart, label: 'Cart' },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Icon size={14} className="text-muted-foreground shrink-0" />
                      {label}
                    </Link>
                  ))}

                  <div className="mt-1 pt-1 border-t border-white/8">
                    <button
                      type="button"
                      onClick={() => { signOut({ redirectUrl: '/' }); setDropdownOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <LogOut size={14} className="shrink-0" />
                      Sign out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Show>
    </>
  );
}

function NavAuthSection({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    if (mobile) {
      return (
        <>
          <div className="h-5 w-16 rounded bg-white/5 animate-pulse" />
          <div className="h-5 w-16 rounded bg-white/5 animate-pulse" />
        </>
      );
    }
    return (
      <>
        <div className="h-5 w-14 rounded bg-white/5 animate-pulse" />
        <div className="h-5 w-16 rounded bg-white/5 animate-pulse" />
      </>
    );
  }

  return <NavAuthLive mobile={mobile} onClose={onClose} />;
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-panel border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 z-50 group">
          <span className="font-display font-bold text-xl tracking-wide text-gradient">VYBE</span>
          <span className="text-muted-foreground ml-0.5 font-medium text-sm uppercase tracking-widest">
            Technologies
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.href} item={link} isActive={pathname === link.href} />
          ))}

          <div className="flex items-center gap-4 pl-2 border-l border-border/60">
            <NavAuthSection />
            <NavCartButton />
          </div>

          <Link
            href="/tech-rescue"
            className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm glow-primary"
          >
            Get Support
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden z-50 text-foreground/80 hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 w-full h-screen bg-background border-b border-border lg:hidden flex flex-col pt-24 px-6 pb-6 gap-6 overflow-y-auto"
            >
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-display font-semibold transition-colors text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-2xl font-display font-semibold transition-colors ${
                      pathname === link.href ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="flex items-center justify-center gap-6">
                <NavAuthSection mobile onClose={() => setMobileMenuOpen(false)} />
                <NavCartButton mobile />
              </div>

              <div className="mt-auto pt-6 border-t border-border flex flex-col gap-4">
                <Link
                  href="/tech-rescue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 text-center bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  Get Support
                </Link>
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{CONTACT.phoneDisplay}</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
