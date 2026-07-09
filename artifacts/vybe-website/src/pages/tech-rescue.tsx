import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { Wrench, Clock, Wifi, Printer, Laptop } from 'lucide-react';

export default function TechRescue() {
  return (
    <>
      <SEO title="Tech Rescue" description="One-off emergency support for slow computers, internet drops, printer issues, and device setups in Fargo, ND." />
      
      <section className="pt-32 pb-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="text-primary hover:underline mb-6 inline-block font-medium">&larr; Back to Services</Link>
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-8 text-primary border border-primary/30">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Tech Rescue</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              When things break, we fix them. On-site, straightforward repair and setup without the long-term commitment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Fast, Friendly Fixes</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Sometimes you just need a printer to print, or a slow computer to finally speed up. You don't need a monthly plan—you just need a professional to come over and sort it out.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We'll come to your home or office, diagnose the issue, and explain what needs to happen in plain English.
              </p>

              <div className="bg-card border border-border rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-2">Pricing</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">$99</span>
                  <span className="text-muted-foreground">diagnostic + 1st hour</span>
                </div>
                <p className="text-sm text-muted-foreground">Extra time billed at $30 per half hour. No surprise bills.</p>
              </div>
              
              <Link href="/contact" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded text-lg font-bold hover:bg-primary/90 transition-all">
                Book a Rescue Visit
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <Clock className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">Slow Computers</h4>
                <p className="text-sm text-muted-foreground">We clean up junk files, remove bloatware, and upgrade hardware to breathe new life into old machines.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Wifi className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">Wi-Fi & Internet</h4>
                <p className="text-sm text-muted-foreground">Dead zones? Constant drops? We'll fix your network so Netflix stops buffering.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Printer className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">Printers</h4>
                <p className="text-sm text-muted-foreground">The bane of modern existence. We'll get it connected and printing reliably.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Laptop className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">New Device Setup</h4>
                <p className="text-sm text-muted-foreground">Just bought a new PC or Mac? We'll set it up securely and transfer all your old data over.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
