import { LegalPage } from '@/components/shared/legal-page';
import { CONTACT } from '@/lib/contact-info';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Security',
  description: 'How VYBE Technologies protects data and how to report a security concern.',
  path: '/security',
});

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      description="How we protect information, and how to report a security concern."
      lastUpdated="July 13, 2026"
    >
      <p>
        VYBE Technologies takes the security of our website, our infrastructure, and the
        information entrusted to us seriously. This page describes our general approach and how to
        report a potential vulnerability.
      </p>

      <h2>How we protect information</h2>
      <ul>
        <li>Data submitted through our website (bookings, contact forms, career interest) is transmitted over encrypted connections (HTTPS).</li>
        <li>Photo uploads use direct-to-storage upload URLs rather than passing files through unrelated systems.</li>
        <li>Access to customer and business data is limited to team members who need it to do their jobs.</li>
        <li>We rely on reputable, security-conscious infrastructure and email-delivery providers for hosting and notifications.</li>
      </ul>

      <h2>Reporting a vulnerability</h2>
      <p>
        If you believe you&rsquo;ve found a security vulnerability affecting our website or
        services, please report it to us before disclosing it publicly, so we have an opportunity
        to investigate and address it. Email{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with a description of the issue,
        the steps to reproduce it, and any relevant details. We will acknowledge reports and
        follow up as we investigate.
      </p>
      <p>
        Please act in good faith: avoid accessing, modifying, or deleting data that isn&rsquo;t
        yours, and avoid testing that could degrade the service for other users.
      </p>
    </LegalPage>
  );
}
