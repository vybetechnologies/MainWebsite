import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone, ShoppingCart, LogIn, UserPlus } from 'lucide-react';
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

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 z-50 group">
          <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
          <span className="font-display font-bold text-xl tracking-wide">
            <span className="text-primary">VYBE</span>
            <span className="text-muted-foreground ml-1.5 font-medium text-sm uppercase tracking-widest">Technologies</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              {link.label}
            </Link>
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
            href="/contact" 
            className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_20px_0_hsl(var(--primary)/0.5)]"
          >
            Book a Service
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 text-foreground/80 hover:text-primary transition-colors"
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
              className="absolute top-0 left-0 w-full h-screen bg-background border-b border-border md:hidden flex flex-col pt-24 px-6 pb-6 gap-6"
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-display font-semibold transition-colors ${
                    location === link.href ? 'text-primary' : 'text-foreground'
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
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 text-center bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  Book a Service
                </Link>
                <a href={`tel:${CONTACT.phoneTel}`} className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors">
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
