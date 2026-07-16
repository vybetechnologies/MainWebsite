import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import CustomerClientLayout from './customer-client-layout';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerClientLayout>
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col pt-20 md:pt-0">
        {children}
      </main>
      <Footer />
      <PageViewTracker />
    </CustomerClientLayout>
  );
}
