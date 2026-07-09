import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { Shield, Lock, AlertTriangle, Search } from 'lucide-react';

export default function Cybersecurity() {
  return (
    <>
      <SEO title="Cybersecurity & Scam Protection" description="Protect your digital life. We clean up after scams and set up defenses to prevent future ones." />
      
      <section className="pt-32 pb-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/cyber-bg.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/50"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="text-primary hover:underline mb-6 inline-block font-medium">&larr; Back to Services</Link>
            <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mb-8 text-secondary border border-secondary/30 shadow-[0_0_30px_0_hsl(var(--secondary)/0.3)]">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Cybersecurity & Scam Protection</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Don't be a target. We secure your devices and help you recover safely if you've been compromised.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Real Threats Need Real Protection</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Scams have gotten incredibly sophisticated. Pop-ups claiming your computer is infected, fake emails from your bank, and fraudulent tech support calls trick thousands of people every day.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you want to be proactive and lock down your digital life, or you've accidentally clicked something you shouldn't have and need immediate cleanup, we are here to help without judgment.
              </p>

              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-4 text-destructive">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Think you've been scammed?</h3>
                </div>
                <p className="text-foreground/90 mb-4">Disconnect from the internet immediately and do not pay anyone or buy gift cards. Call us for an emergency cleanup.</p>
                <Link href="/contact" className="inline-block px-6 py-3 bg-destructive text-destructive-foreground rounded font-bold hover:bg-destructive/90 transition-all">
                  Get Emergency Help
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-6 bg-card border border-border p-6 rounded-xl">
                <Search className="w-8 h-8 text-secondary shrink-0" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Scam Cleanup</h4>
                  <p className="text-muted-foreground">Deep system scans to remove remote access tools, malware, and trackers left behind by scammers.</p>
                </div>
              </div>
              <div className="flex gap-6 bg-card border border-border p-6 rounded-xl">
                <Lock className="w-8 h-8 text-secondary shrink-0" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Password Management</h4>
                  <p className="text-muted-foreground">We help you set up a secure password manager so you never have to remember dozens of complex passwords again.</p>
                </div>
              </div>
              <div className="flex gap-6 bg-card border border-border p-6 rounded-xl">
                <Shield className="w-8 h-8 text-secondary shrink-0" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Proactive Defense</h4>
                  <p className="text-muted-foreground">Installation of reputable antivirus, ad-blockers, and browser protections to stop threats before they load.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
