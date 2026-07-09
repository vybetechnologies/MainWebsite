import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col pt-20 md:pt-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
