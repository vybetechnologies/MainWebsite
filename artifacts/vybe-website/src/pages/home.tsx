import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { ArrowRight, ShieldCheck, HeartHandshake, Zap, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <SEO title="Home" />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 pt-20 pb-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">Serving Fargo, ND & Surrounding Areas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-8 leading-tight">
              Premium Tech Support. <br/>
              <span className="text-gradient glow-primary">Approachable Human Experts.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              We come to you. No big-box frustration, no condescension. Just the tech friend you wish you had, in a professional suit.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded text-lg font-medium hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
              >
                Book a Service
              </Link>
              <Link 
                href="/services" 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded text-lg font-medium hover:bg-white/10 transition-all"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props Strip */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex items-center gap-4 md:px-6 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">We Come To You</h3>
                <p className="text-sm text-muted-foreground">On-site support in Fargo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:px-6 pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Trusted & Secure</h3>
                <p className="text-sm text-muted-foreground">Premium cybersecurity included</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:px-6 pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Jargon-Free</h3>
                <p className="text-sm text-muted-foreground">Clear, approachable communication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Teaser */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">How Can We Help?</h2>
            <p className="text-muted-foreground text-lg">Whether you're a grandparent trying to set up a new iPad, or a small business needing complete IT management, we have a plan for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link href="/services/tech-rescue" className="group block h-full">
              <div className="h-full bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] hover:-translate-y-2">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors">Tech Rescue</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">One-off emergency support for slow computers, internet drops, printer issues, or a sudden glitch. We arrive, diagnose, and fix.</p>
                <div className="flex items-center text-primary font-medium mt-auto">
                  Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/services/home-tech-care" className="group block h-full">
              <div className="h-full bg-card border border-border rounded-xl p-8 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--secondary)/0.2)] hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] -z-10 group-hover:bg-secondary/10 transition-colors"></div>
                <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-secondary transition-colors">Home Tech Care</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">Ongoing subscription for home users. Get regular maintenance, remote support, and peace of mind knowing your digital life is protected.</p>
                <div className="flex items-center text-secondary font-medium mt-auto">
                  Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/services/business-tech-management" className="group block h-full">
              <div className="h-full bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] hover:-translate-y-2">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors">Business IT</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">Fully managed IT for small businesses. Device setup, network management, employee onboarding, and robust cybersecurity.</p>
                <div className="flex items-center text-primary font-medium mt-auto">
                  Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:bg-white/5 rounded transition-colors font-medium">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-20 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-medium mb-6">"Finally, an IT company that actually listens and doesn't make me feel stupid."</h2>
          <p className="text-muted-foreground font-medium">— Sarah M., Fargo Small Business Owner</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Stop Fighting Your Tech.</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Book a service today and let VYBE Technologies handle the rest. Friendly, expert help is just a click away.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-10 py-5 bg-primary text-primary-foreground rounded text-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_40px_0_hsl(var(--primary)/0.6)] hover:-translate-y-1"
          >
            Get Help Now
          </Link>
        </div>
      </section>
    </>
  );
}
