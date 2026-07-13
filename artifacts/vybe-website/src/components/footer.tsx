'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import { CONTACT } from '@/lib/contact-info';

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Newsroom', href: '/newsroom' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'For Individuals', href: '/solutions#individuals' },
      { label: 'For Businesses', href: '/solutions#businesses' },
      { label: 'For Communities', href: '/solutions#communities' },
      { label: 'Tech Rescue', href: '/tech-rescue' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'VYBE Circle', href: '/products#circle' },
      { label: 'VYBE Key', href: '/products#key' },
      { label: 'VYBE HUB', href: '/products#hub' },
      { label: 'All Products', href: '/products' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-bold text-xl tracking-wide text-gradient">VYBE</span>
              <span className="text-muted-foreground ml-0.5 font-medium text-sm uppercase tracking-widest">
                Technologies
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Technology built around real life — digital products, technology services, and
              business solutions from Fargo, North Dakota.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="VYBE Technologies on LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="VYBE Technologies on X"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="VYBE Technologies on GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="font-display font-semibold text-lg mb-6">{column.title}</h4>
              <ul className="flex flex-col gap-4 text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 shrink-0" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contact</h4>
            <ul className="flex flex-col gap-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  {CONTACT.addressLine1}
                  <br />
                  {CONTACT.addressLine2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-primary transition-colors">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VYBE Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
