import { LegalPage } from '@/components/shared/legal-page';
import { CONTACT } from '@/lib/contact-info';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Legal Notices',
  description: 'Company and legal information for VYBE Technologies Inc.',
  path: '/legal-notices',
});

export default function LegalNoticesPage() {
  return (
    <LegalPage
      title="Legal Notices"
      description="Company information and legal notices for VYBE Technologies."
      lastUpdated="July 13, 2026"
    >
      <h2>Company information</h2>
      <p>
        This website is operated by VYBE Technologies Inc., headquartered in Fargo, North Dakota.
      </p>
      <ul>
        <li>
          <strong>Registered mailing address:</strong> {CONTACT.addressLine1}, {CONTACT.addressLine2}
        </li>
        <li>
          <strong>Email:</strong> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
        <li>
          <strong>Phone:</strong> <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>
        </li>
      </ul>

      <h2>Related policies</h2>
      <p>
        This page is a company-information notice. For how we handle personal data, see our{' '}
        <a href="/privacy">Privacy Policy</a>. For the terms that govern use of our website and
        services, see our <a href="/terms">Terms of Service</a>.
      </p>

      <h2>Trademarks</h2>
      <p>
        VYBE, VYBE Technologies, VYBE Tech Rescue, VYBE Circle, VYBE Key, VYBE Mail, VYBE Sound,
        VYBE TV, VYBE ID, and VYBE HUB are trademarks of VYBE Technologies Inc. Other product and
        company names mentioned on this site may be trademarks of their respective owners.
      </p>

      <h2>Copyright</h2>
      <p>
        © {new Date().getFullYear()} VYBE Technologies Inc. All rights reserved. The content,
        design, and code of this website may not be reproduced without prior written permission.
      </p>
    </LegalPage>
  );
}
