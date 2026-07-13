import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VYBE Technologies | Technology built around real life.',
    template: '%s | VYBE Technologies',
  },
  description:
    'VYBE Technologies is a technology company building digital products, delivering technology services, and powering business solutions — headquartered in Fargo, North Dakota.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col pt-20 md:pt-0">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
