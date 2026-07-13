import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { Home as HomeIcon, Heart, PhoneCall, ShieldCheck } from 'lucide-react';

export default function HomeTechCare() {
  return (
    <>
      <SEO title="Home Tech Care" description="Ongoing tech support subscription for home users and seniors in Fargo, ND." />
      
      <section className="pt-32 pb-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="text-secondary hover:underline mb-6 inline-block font-medium">&larr; Back to Services</Link>
            <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mb-8 text-secondary border border-secondary/30">
              <HomeIcon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Home Tech Care</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your personal IT department. Ongoing support, maintenance, and peace of mind for you or your parents.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Peace of Mind for Families</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Tired of being your family's designated tech support? Worried about your parents clicking on scam emails? The Home Tech Care plan is designed to provide ongoing protection and friendly help whenever it's needed.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                For a flat monthly fee, we handle the frustrating parts of technology, keeping devices secure and running smoothly.
              </p>

              <div className="bg-card border-2 border-secondary/50 rounded-xl p-8 mb-8 shadow-[0_0_30px_-10px_hsl(var(--secondary)/0.3)]">
                <h3 className="text-xl font-bold mb-2">Subscription</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-muted-foreground">Starting at</span>
                  <span className="text-3xl font-bold text-secondary">$49</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">Covers up to 3 devices in a single household.</p>
              </div>
              
              <Link href="/contact" className="inline-block px-8 py-4 bg-secondary text-secondary-foreground rounded text-lg font-bold hover:bg-secondary/90 transition-all">
                Sign Up Now
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <Heart className="w-10 h-10 text-secondary mb-4" />
                <h4 className="font-bold mb-2">Annual Tune-Up</h4>
                <p className="text-sm text-muted-foreground">A yearly on-site visit to physically clean devices, check hardware health, and optimize performance.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <PhoneCall className="w-10 h-10 text-secondary mb-4" />
                <h4 className="font-bold mb-2">Priority Remote Support</h4>
                <p className="text-sm text-muted-foreground">Got a weird error? Call us. We can securely remote into the computer and fix it without a visit.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 sm:col-span-2">
                <ShieldCheck className="w-10 h-10 text-secondary mb-4" />
                <h4 className="font-bold mb-2">Managed Antivirus</h4>
                <p className="text-sm text-muted-foreground">We install enterprise-grade protection on your devices that we monitor silently. If a virus tries to attack, we stop it automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
