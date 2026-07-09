import { Link } from 'wouter';
import { Shield, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:bg-primary/30 transition-colors">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-wide">
                <span className="text-primary">VYBE</span>
                <span className="text-muted-foreground ml-1.5 font-medium text-sm uppercase tracking-widest">Technologies</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Trusted, approachable tech support for individuals, seniors, and small businesses. We come to you, solving tech headaches without the jargon.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Services</h4>
            <ul className="flex flex-col gap-4 text-muted-foreground">
              <li>
                <Link href="/services/home-tech-care" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Home Tech Care
                </Link>
              </li>
              <li>
                <Link href="/services/business-tech-management" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Business IT
                </Link>
              </li>
              <li>
                <Link href="/services/cybersecurity" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/services/ai-setup" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> AI Setup & Training
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Pricing
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> All Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contact</h4>
            <ul className="flex flex-col gap-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Fargo, North Dakota<br/>(We come to you)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>Coming Soon</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:support@vybetechnologies.net" className="hover:text-primary transition-colors">
                  support@vybetechnologies.net
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/contact" className="inline-block px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Book Now
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VYBE Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
