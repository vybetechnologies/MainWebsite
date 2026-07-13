import { LegalPage } from '@/components/shared/legal-page';
import { CONTACT } from '@/lib/contact-info';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How VYBE Technologies collects, uses, and protects information for visitors and customers.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we collect, use, and protect information across our website and services."
      lastUpdated="July 13, 2026"
    >
      <p>
        VYBE Technologies Inc. (&ldquo;VYBE,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) respects your privacy. This policy explains what information we
        collect through vybetechnologies.net and our Tech Rescue service (the
        &ldquo;Services&rdquo;), how we use it, and the choices available to you.
      </p>

      <h2>Information you provide to us</h2>
      <p>We collect information you choose to give us directly, including:</p>
      <ul>
        <li>
          <strong>Contact and booking details</strong> — name, email address, phone number, and
          mailing address, when you submit a contact form, book a Tech Rescue service, or apply
          for a role on our Careers page.
        </li>
        <li>
          <strong>Service details</strong> — a description of the issue, device type, brand/model,
          and preferred appointment details when you request a repair or support visit.
        </li>
        <li>
          <strong>Photos you upload</strong> — if you attach a photo of a device to a Tech Rescue
          request to help us diagnose the issue before your appointment.
        </li>
        <li>
          <strong>Career and interest submissions</strong> — resume, cover letter, or interest
          details you submit through our Careers page.
        </li>
      </ul>

      <h2>Information we collect automatically</h2>
      <p>
        We keep automatic data collection to a minimum. Our website records an anonymous count of
        page views per page and per day so we can understand which parts of the site are useful —
        this record contains only the page path and a date, never an IP address, device
        identifier, or any other visitor-specific data, and it does not use cookies, local
        storage, or any other tracking technology. Because we do not set tracking cookies, no
        cookie-consent banner is required or shown.
      </p>
      <p>
        Our hosting and infrastructure providers may keep standard server logs (such as request
        timestamps) for security and reliability purposes; we do not use these logs for analytics
        or advertising.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to contact, booking, and career inquiries and to schedule Tech Rescue appointments.</li>
        <li>To send booking confirmations and service-related updates about a request you submitted.</li>
        <li>To route your message to the right team (for example, support versus careers).</li>
        <li>To maintain, secure, and improve our website and Services.</li>
        <li>To comply with legal obligations and enforce our Terms of Service.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for third-party advertising.</p>

      <h2>How we share your information</h2>
      <p>We share information only as needed to operate our business:</p>
      <ul>
        <li>
          <strong>Service providers</strong> — email delivery (for booking and contact
          notifications), object storage (for uploaded photos), and hosting/infrastructure
          providers, each bound to use your data only to provide services to us.
        </li>
        <li><strong>Legal and safety</strong> — when required by law, subpoena, or to protect the rights, property, or safety of VYBE, our customers, or others.</li>
        <li><strong>Business transfers</strong> — if VYBE is involved in a merger, acquisition, or sale of assets, in which case we will notify you of any material change to how your information is handled.</li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We retain booking, contact, and career submissions for as long as reasonably necessary to
        respond to your request, provide the Services, and meet legal, accounting, or reporting
        requirements. Anonymous, aggregate page-view counts are retained for internal reporting
        purposes and are not tied to any individual.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You may ask us to access, correct, or delete the personal information you have provided to
        us by contacting {CONTACT.email}. Depending on your state of residence, you may have
        additional rights under applicable privacy law; we will honor valid requests to the extent
        required by law.
      </p>

      <h2>Data security</h2>
      <p>
        We use reasonable administrative and technical safeguards designed to protect the
        information we hold. No method of transmission or storage is completely secure, so we
        cannot guarantee absolute security.
      </p>

      <h2>Children&rsquo;s privacy</h2>
      <p>
        Our Services are intended for individuals who are at least 18 years old, or businesses
        acting through an authorized adult representative. We do not knowingly collect personal
        information from children under 13.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date
        above reflects the most recent revision. Material changes will be reflected on this page.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or your information? Reach us at{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, by phone at{' '}
        <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>, or by mail at{' '}
        {CONTACT.addressLine1}, {CONTACT.addressLine2}.
      </p>
    </LegalPage>
  );
}
