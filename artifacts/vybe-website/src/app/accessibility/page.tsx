import { LegalPage } from '@/components/shared/legal-page';
import { CONTACT } from '@/lib/contact-info';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Accessibility',
  description: 'Our commitment to an accessible website and how to report accessibility issues.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      description="Our commitment to making our website usable by everyone."
      lastUpdated="July 13, 2026"
    >
      <p>
        VYBE Technologies is committed to making vybetechnologies.net accessible to the widest
        possible audience, including people with disabilities, regardless of the device or
        assistive technology they use.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>We design with sufficient color contrast between text and its background.</li>
        <li>We support keyboard navigation for menus, forms, and calls to action, including a visible focus indicator and a skip-to-content link.</li>
        <li>We use semantic HTML and descriptive labels so screen readers can interpret navigation, forms, and interactive controls.</li>
        <li>We respect your device&rsquo;s reduced-motion setting and minimize animation when it is enabled.</li>
        <li>We are working through the accessibility guidance in the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, as an ongoing standard for this website.</li>
      </ul>

      <h2>Ongoing work</h2>
      <p>
        Accessibility is an ongoing effort. As we add new pages and features, we review them
        against the same standard and correct issues as they are identified.
      </p>

      <h2>Reporting an issue</h2>
      <p>
        If you encounter a barrier using our website, or need information in an alternate format,
        please let us know at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or by phone
        at <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>. Please include the page
        you were on and a description of the issue so we can investigate and respond.
      </p>
    </LegalPage>
  );
}
