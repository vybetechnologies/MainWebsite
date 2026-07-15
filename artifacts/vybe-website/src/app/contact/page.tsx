import { ContactPageDynamic } from '@/components/contact/contact-page-dynamic';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description: 'Get in touch with VYBE Technologies by phone, email, or mail.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactPageDynamic />;
}
