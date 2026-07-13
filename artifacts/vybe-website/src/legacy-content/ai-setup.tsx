import { SEO } from '@/components/seo';
import { Link } from 'wouter';
import { BrainCircuit, Lightbulb, Rocket, MessageSquare } from 'lucide-react';

export default function AISetup() {
  return (
    <>
      <SEO title="AI Setup & Training" description="Learn how to use modern AI tools to save time and boost productivity in Fargo." />
      
      <section className="pt-32 pb-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="text-primary hover:underline mb-6 inline-block font-medium">&larr; Back to Services</Link>
            <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center mb-8 text-purple-400 border border-purple-500/30">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">AI Setup & Training</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Demystify Artificial Intelligence. We teach you how to use tools like ChatGPT safely and effectively.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">AI is a Tool, Not Magic</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                The news makes AI sound terrifying, but in reality, it's just a powerful new tool. Whether you want to write emails faster, brainstorm ideas, or summarize long documents, AI can save you hours of work.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our one-on-one training sessions break down the jargon. We'll set up the right tools on your devices and teach you exactly how to talk to them (prompt engineering) to get useful results.
              </p>

              <Link href="/contact" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded text-lg font-bold hover:bg-primary/90 transition-all">
                Book a Training Session
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <MessageSquare className="w-10 h-10 text-purple-400 mb-4" />
                <h4 className="font-bold mb-2">ChatGPT Mastery</h4>
                <p className="text-sm text-muted-foreground">Account setup and hands-on practice writing effective prompts.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Lightbulb className="w-10 h-10 text-purple-400 mb-4" />
                <h4 className="font-bold mb-2">Business Workflows</h4>
                <p className="text-sm text-muted-foreground">Discover how to use AI to draft marketing copy, analyze data, and reply to customers.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 sm:col-span-2">
                <Rocket className="w-10 h-10 text-purple-400 mb-4" />
                <h4 className="font-bold mb-2">Privacy & Ethics</h4>
                <p className="text-sm text-muted-foreground">Crucial training on what information is safe to share with AI and how to prevent confidential data leaks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
