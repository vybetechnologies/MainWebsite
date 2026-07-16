'use client';

const PARTNERS = [
  { name: "Microsoft", logo: "/partners/microsoft.png" },
  { name: "Google", logo: "/partners/google.svg" },
  { name: "Cloudflare", logo: "/partners/cloudflare.png" },
  { name: "Fly.io", logo: "/partners/flyio.png" },
  { name: "Neon", logo: "/partners/neon.svg" },
  { name: "Pax8", logo: "/partners/pax8.png" },
  { name: "MobileSentrix", logo: "/partners/mobilesentrix.png" },
  { name: "Grasshopper", logo: "/partners/grasshopper.png" },
  { name: "Square", logo: "/partners/square.svg" },
  { name: "Bluevine", logo: "/partners/bluevine.svg" },
  { name: "Stripe", logo: "/partners/stripe.svg" },
  { name: "Wave Advisors", logo: "/partners/wave.svg" },
  { name: "Ooma Office", logo: "/partners/ooma.svg" },
];

export function Partners() {
  return (
    <section className="py-20 md:py-28 border-y border-border bg-card/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Our Partners
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Backed by Trusted Technology Leaders
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-24 bg-white rounded-xl px-6 py-4 shadow-sm"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 max-w-full w-auto h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}