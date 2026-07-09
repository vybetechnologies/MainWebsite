import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { Building2, Server, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BusinessTech() {
  return (
    <>
      <SEO title="Business IT Management" description="Fully managed IT for small businesses in Fargo. Device setup, network management, and robust cybersecurity." />
      
      <section className="pt-32 pb-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="text-primary hover:underline mb-6 inline-block font-medium">&larr; Back to Services</Link>
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-8 text-primary border border-primary/30">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Business IT Management</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Act as your dedicated, outsourced IT department. We handle the tech so you can handle your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Enterprise Tech for Small Business</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Small businesses are the biggest targets for cyberattacks, yet they often have the least protection. They struggle with employee onboarding, tangled networks, and unpredictable IT costs.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                VYBE Technologies provides a comprehensive, managed IT subscription that gives you a predictable monthly cost and the peace of mind that everything is monitored, backed up, and secure.
              </p>

              <div className="bg-card border border-border rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-4">What's Included:</h3>
                <ul className="space-y-4">
                  {[
                    "Microsoft 365 / Google Workspace administration",
                    "Employee device setup and onboarding",
                    "Network and Wi-Fi management",
                    "Continuous data backup solutions",
                    "Proactive device monitoring",
                    "Priority emergency support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href="/contact" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded text-lg font-bold hover:bg-primary/90 transition-all">
                Discuss Your Business Needs
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <Server className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">Network Health</h4>
                <p className="text-sm text-muted-foreground">Keep your office Wi-Fi fast, secure, and segregated for guests and internal data.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">Access Control</h4>
                <p className="text-sm text-muted-foreground">Manage who has access to what files. Add and remove employees securely.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold mb-2">Endpoint Security</h4>
                <p className="text-sm text-muted-foreground">Next-generation antivirus and threat hunting on all company devices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
