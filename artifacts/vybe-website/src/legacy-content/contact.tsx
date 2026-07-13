import { SEO } from '@/components/seo';
import { Mail, MapPin, Phone, BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import { CONTACT } from '@/lib/contact-info';
import { useCreateBookingRequest } from '@workspace/api-client-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bookingRequest = useCreateBookingRequest();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const service = String(formData.get('service') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    bookingRequest.mutate(
      {
        data: {
          firstName,
          lastName,
          email,
          ...(phone ? { phone } : {}),
          service,
          message,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          form.reset();
        },
        onError: () => {
          setErrorMessage(
            "Something went wrong sending your request. Please try again or call us directly."
          );
        },
      }
    );
  };

  return (
    <>
      <SEO title="Contact & Book" description="Book a service with VYBE Technologies in Fargo, ND." />
      
      <section className="pt-32 pb-20 border-b border-border bg-card/30">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Let's Fix Your Tech.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Fill out the form below or reach out directly. We'll get back to you within 24 hours to schedule a visit.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-8">Get In Touch</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Service Area</h4>
                    <p className="text-muted-foreground">Fargo, North Dakota<br/>and surrounding areas</p>
                    <p className="text-sm text-primary mt-2 font-medium">Note: We come to you!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <a href={`tel:${CONTACT.phoneTel}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <a href={`mailto:${CONTACT.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Mailing Address</h4>
                    <p className="text-muted-foreground">{CONTACT.addressLine1}<br/>{CONTACT.addressLine2}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Registered & Insured</h4>
                    <p className="text-muted-foreground">Book with confidence knowing we're a registered, insured business.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h4 className="font-bold mb-2">Emergency?</h4>
                <p className="text-sm text-muted-foreground">If you believe you have been compromised by a scam or ransomware, please indicate this in your message for priority response.</p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-xl">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">Request Sent!</h3>
                  <p className="text-muted-foreground mb-8">We've received your information and will be in touch shortly to confirm your service.</p>
                  <button onClick={() => setSubmitted(false)} className="text-primary hover:underline">Submit another request</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input name="firstName" required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input name="lastName" required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input name="email" required type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="jane@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input name="phone" type="tel" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="(555) 123-4567" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Needed</label>
                    <select name="service" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
                      <option>Tech Rescue (One-off fix)</option>
                      <option>Home Tech Care Subscription</option>
                      <option>Business IT Management</option>
                      <option>Cybersecurity & Scam Cleanup</option>
                      <option>AI Setup & Training</option>
                      <option>Other / Unsure</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Describe your issue</label>
                    <textarea name="message" required rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" placeholder="Tell us what's going on..."></textarea>
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={bookingRequest.isPending}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {bookingRequest.isPending ? 'Sending...' : 'Send Request'}
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
