import type { Metadata } from 'next';
import { ContactPageContent } from '@/components/contact/contact-page-content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with VYBE Technologies by phone, email, or mail.',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
