'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ShoppingCart, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT } from '@/lib/contact-info';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

function ComingSoonButton({
  icon,
  label,
  className = '',
}: {
  icon: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label={`${label} (coming soon)`}
          className={`flex items-center gap-1.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed opacity-60 ${className}`}
        >
          {icon}
          <span>{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>Coming soon</TooltipContent>
    </Tooltip>
  );
}

interface NavItem {
  label: string;
  href: string;
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
  { label: 'About', href: '/about' },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

function NavLinkItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [open, setOpen] = useState(false);

  if (!item.megaMenu) {
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

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
            <ComingSoonButton icon={<LogIn className="w-4 h-4" />} label="Log In" />
            <ComingSoonButton icon={<UserPlus className="w-4 h-4" />} label="Sign Up" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  aria-label="Cart (coming soon)"
                  className="text-muted-foreground/50 cursor-not-allowed opacity-60"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
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
              {NAV_LINKS.map((link) => (
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
              ))}
              <div className="flex items-center justify-center gap-6">
                <ComingSoonButton icon={<LogIn className="w-4 h-4" />} label="Log In" />
                <ComingSoonButton icon={<UserPlus className="w-4 h-4" />} label="Sign Up" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      aria-label="Cart (coming soon)"
                      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed opacity-60"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Cart</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
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
