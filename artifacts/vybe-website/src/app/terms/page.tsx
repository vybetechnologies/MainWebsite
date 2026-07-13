import { LegalPage } from '@/components/shared/legal-page';
import { CONTACT } from '@/lib/contact-info';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'The terms that govern your use of the VYBE Technologies website and services.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The terms that govern your use of our website and services."
      lastUpdated="July 13, 2026"
    >
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
        vybetechnologies.net and the services offered by VYBE Technologies Inc.
        (&ldquo;VYBE,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), including
        VYBE Tech Rescue (collectively, the &ldquo;Services&rdquo;). By using our Services, you
        agree to these Terms. If you do not agree, please do not use our Services.
      </p>

      <h2>Who can use our Services</h2>
      <p>
        You must be at least 18 years old, or using our Services on behalf of a business with
        authority to bind that business, to submit a booking, contact, or career inquiry through
        our Services.
      </p>

      <h2>Tech Rescue bookings</h2>
      <ul>
        <li>
          A booking request submitted through our website is a request for service, not a
          confirmed appointment, until we contact you to confirm scheduling and pricing.
        </li>
        <li>
          Estimates provided before an in-person diagnosis are approximate. Final pricing is
          based on the actual work performed and will be communicated before we proceed.
        </li>
        <li>
          You are responsible for backing up your data before any repair or service. VYBE is not
          responsible for data loss except where caused by our gross negligence or willful
          misconduct.
        </li>
        <li>
          Photos you upload with a booking request are used solely to help our technicians
          diagnose the issue ahead of your appointment.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>When using our Services, you agree not to:</p>
      <ul>
        <li>Submit false, misleading, or fraudulent information in any form or booking request.</li>
        <li>Attempt to interfere with, disrupt, or gain unauthorized access to our website, systems, or data.</li>
        <li>Use automated tools to scrape, spam, or overload our booking, contact, or upload endpoints.</li>
        <li>Use our Services for any unlawful purpose or in violation of any applicable law.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The VYBE name, logo, and all content on this website — including text, graphics, and
        design — are owned by VYBE Technologies Inc. or its licensors and are protected by
        intellectual property law. You may not reproduce, distribute, or create derivative works
        from our content without our prior written consent, except as necessary to use the
        Services as intended.
      </p>

      <h2>Third-party services</h2>
      <p>
        Our Services may rely on third-party providers (for example, email delivery and file
        storage). We are not responsible for the availability or content of third-party services,
        and your use of them may be subject to their own terms.
      </p>

      <h2>Disclaimers</h2>
      <p>
        Our Services are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
        warranties of any kind, whether express or implied, including implied warranties of
        merchantability, fitness for a particular purpose, and non-infringement, to the fullest
        extent permitted by law.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, VYBE Technologies Inc. will not be liable for any
        indirect, incidental, special, consequential, or punitive damages arising from your use of
        our Services. Our total liability for any claim relating to the Services will not exceed
        the amount you paid us for the specific service giving rise to the claim.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of North Dakota, without regard to its
        conflict-of-laws principles, and any dispute will be subject to the exclusive jurisdiction
        of the state and federal courts located in North Dakota.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date above
        reflects the most recent revision. Continued use of our Services after a change
        constitutes acceptance of the updated Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms? Reach us at{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or by phone at{' '}
        <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>.
      </p>
    </LegalPage>
  );
}
