import { SEO } from '@/components/seo';
import { ShieldCheck, HeartHandshake, Zap, Award, BadgeCheck } from 'lucide-react';

export default function About() {
  return (
    <>
      <SEO title="About Us" description="Learn about VYBE Technologies, our mission, and why we are Fargo's most trusted approachable tech support company." />
      
      {/* Page Header */}
      <section className="pt-32 pb-20 border-b border-border bg-card/30">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Tech Support with <span className="text-gradient">Heart.</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We started VYBE Technologies because we were tired of seeing people intimidated by their own devices, and tired of the condescending attitudes found in traditional IT.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Technology is supposed to make our lives easier, but too often it becomes a source of extreme stress. Whether it's a small business struggling to keep its data secure, or a grandparent terrified they clicked the wrong link in an email, the fear is real.
              </p>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Our mission is to bring high-end, corporate-grade IT expertise to everyday people and small businesses in Fargo, ND—delivered with warmth, patience, and absolute respect.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We don't just fix computers. We restore confidence.
              </p>
            </div>
            
            <div className="order-1 md:order-2 relative">
              <div className="aspect-square rounded-2xl bg-card border border-border overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20"></div>
                {/* Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                  <div className="absolute w-48 h-48 border border-primary/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                  <ShieldCheck className="absolute w-20 h-20 text-primary opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 md:py-32 bg-card/50 border-y border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Who We Serve</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built our services around the people who need reliable help the most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-background border border-border rounded-xl">
              <h3 className="text-2xl font-display font-bold mb-4">Individuals & Families</h3>
              <p className="text-muted-foreground">From home office setups to troubleshooting erratic Wi-Fi, we keep your household connected and running smoothly.</p>
            </div>
            <div className="p-8 bg-background border border-primary/30 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <h3 className="text-2xl font-display font-bold mb-4">Seniors</h3>
              <p className="text-muted-foreground">Patient, step-by-step help. We specialize in scam cleanup, simple device setups, and teaching how to use modern tools safely without the jargon.</p>
            </div>
            <div className="p-8 bg-background border border-border rounded-xl">
              <h3 className="text-2xl font-display font-bold mb-4">Small Businesses</h3>
              <p className="text-muted-foreground">Complete managed IT. We act as your outsourced IT department so you can focus on running your business, knowing your data is secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 text-center">Why Choose VYBE?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Zero Condescension</h4>
                <p className="text-muted-foreground">We never make you feel bad for not knowing something. Questions are encouraged.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Corporate-Grade Expertise</h4>
                <p className="text-muted-foreground">Our background is in high-level IT and cybersecurity. You get enterprise-grade knowledge applied to your specific needs.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">We Come To You</h4>
                <p className="text-muted-foreground">No unplugging your heavy tower and dragging it into a store. We provide on-site support right in Fargo.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Security First</h4>
                <p className="text-muted-foreground">Every action we take keeps your digital safety in mind, protecting you from modern scams and threats.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Registered & Insured</h4>
                <p className="text-muted-foreground">We operate as a fully registered business, and our work is insured for your protection and peace of mind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
