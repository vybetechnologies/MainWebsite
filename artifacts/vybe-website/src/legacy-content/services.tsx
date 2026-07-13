import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { ArrowRight, MonitorSmartphone, Shield, Home as HomeIcon, Building2, BrainCircuit, Wrench } from 'lucide-react';

const services = [
  {
    title: "Tech Rescue",
    slug: "tech-rescue",
    icon: <Wrench className="w-8 h-8" />,
    description: "One-off emergency support for slow computers, internet drops, printer issues, and device setups.",
    features: ["Slow computer repair", "Wi-Fi troubleshooting", "Printer setup", "Data transfer"]
  },
  {
    title: "Home Tech Care",
    slug: "home-tech-care",
    icon: <HomeIcon className="w-8 h-8" />,
    description: "Ongoing subscription for home users. Regular maintenance and priority remote support.",
    features: ["Monthly checkups", "Remote assistance", "Email & password help", "Device maintenance"]
  },
  {
    title: "Business IT Management",
    slug: "business-tech-management",
    icon: <Building2 className="w-8 h-8" />,
    description: "Fully managed IT for small businesses. Device setup, network management, and robust security.",
    features: ["Microsoft 365 / Google Workspace", "Employee onboarding", "Network management", "Backup solutions"]
  },
  {
    title: "Cybersecurity & Scam Protection",
    slug: "cybersecurity",
    icon: <Shield className="w-8 h-8" />,
    description: "Protect your data from threats. We clean up after scams and set up defenses to prevent future ones.",
    features: ["Scam cleanup", "Antivirus setup", "Network security", "Safe browsing habits"]
  },
  {
    title: "AI Setup & Training",
    slug: "ai-setup",
    icon: <BrainCircuit className="w-8 h-8" />,
    description: "Learn how to use modern AI tools to save time, write better, and boost your business productivity.",
    features: ["ChatGPT training", "Business workflow automation", "Prompt engineering basics"]
  }
];

export default function ServicesHub() {
  return (
    <>
      <SEO title="Our Services" description="Comprehensive tech support, cybersecurity, and managed IT services in Fargo, ND." />
      
      <section className="pt-32 pb-20 border-b border-border bg-card/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Expertise for Every Need.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From a single printer jam to full-scale small business network management, we have the skills and patience to fix it right.
          </p>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group block">
                <div className="h-full bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] hover:-translate-y-1 flex flex-col">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-3">{service.title}</h2>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-8 flex-1">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-primary font-medium mt-auto pt-4 border-t border-border group-hover:border-primary/20 transition-colors">
                    View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
