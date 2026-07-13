import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <>
      <SEO title="Pricing" description="Transparent pricing for tech support in Fargo, ND. One-off rescues, home subscriptions, and managed business IT." />
      
      <section className="pt-32 pb-20 bg-card/30">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Clear, Transparent Pricing.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            No hidden fees, no confusing jargon. Choose the tier that fits your needs.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            
            {/* Tier 1 */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-primary/30 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Tech Rescue Visit</h3>
                <p className="text-muted-foreground text-sm">One-time emergency support</p>
              </div>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">diagnostic + 1st hour</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                Extra time billed at $30 per half hour. We'll always tell you if it's worth fixing before we start the clock.
              </p>
              <ul className="space-y-4 mb-10 flex-1">
                {['On-site arrival', 'Full diagnostic', 'Wi-Fi/Printer setup', 'Virus removal', 'Slow computer fix'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="w-full py-4 text-center border border-border hover:bg-white/5 rounded-lg font-medium transition-colors">
                Book a Visit
              </Link>
            </div>

            {/* Tier 2 - Highlighted */}
            <div className="bg-background border-2 border-primary rounded-2xl p-8 flex flex-col relative shadow-[0_0_40px_-15px_hsl(var(--primary)/0.4)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">VYBE Home Tech Care</h3>
                <p className="text-muted-foreground text-sm">Ongoing peace of mind</p>
              </div>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-muted-foreground">Starting at</span>
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                Perfect for seniors and busy families who want a trusted contact for any tech question.
              </p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Priority remote support', 'Annual tune-up visit', 'Basic antivirus included', 'Email & scam checks', 'Discounted hourly rates'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="w-full py-4 text-center bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Subscribe Now
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-primary/30 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Business Tech Mgt.</h3>
                <p className="text-muted-foreground text-sm">Fully managed business IT</p>
              </div>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-muted-foreground">Starting at</span>
                <span className="text-4xl font-bold">$299</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                Custom-tailored IT department for small businesses that need reliability and security.
              </p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Endpoint security software', 'Network monitoring', 'M365/Google Workspace admin', 'Employee onboarding', 'Cloud backup management'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="w-full py-4 text-center border border-border hover:bg-white/5 rounded-lg font-medium transition-colors">
                Get a Quote
              </Link>
            </div>

          </div>

          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground italic">
              "Final pricing may vary based on location, complexity, and business needs."
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
