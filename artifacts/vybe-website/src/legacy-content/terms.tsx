import { SEO } from '@/components/seo';
import { CONTACT } from '@/lib/contact-info';

const LAST_UPDATED = 'July 12, 2026';

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms of Service for VYBE Technologies Inc. — the rules and agreements that govern use of our website and tech support services."
      />

      <section className="pt-32 pb-16 border-b border-border bg-card/30">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto prose prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">

            <p>
              These Terms of Service ("Terms") are a binding agreement between you ("Customer," "you," or "your")
              and VYBE Technologies Inc. ("VYBE," "we," "us," or "our"), a business registered and operating in
              Fargo, North Dakota. These Terms govern your use of our website located at vybetechnologies.net
              (the "Site") and any technology support, repair, consulting, managed IT, cybersecurity, or related
              services we provide (collectively, the "Services"). By visiting the Site, requesting a quote, booking
              an appointment, or otherwise using our Services, you agree to these Terms. If you do not agree,
              please do not use the Site or the Services.
            </p>

            <h2>1. Who We Are</h2>
            <p>
              VYBE Technologies Inc. is a registered and insured technology support company providing on-site and
              remote IT services to individuals, seniors, and small businesses in Fargo, North Dakota and the
              surrounding areas. Our mailing address is {CONTACT.addressLine1}, {CONTACT.addressLine2}. You can
              reach us at {CONTACT.phoneDisplay} or {CONTACT.email}.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old, or the age of majority in your jurisdiction, and have the legal
              authority to enter into a binding contract to use our Services. If you are booking Services on
              behalf of a business, you represent that you have the authority to bind that business to these
              Terms.
            </p>

            <h2>3. Description of Services</h2>
            <p>
              VYBE provides technology support services which may include, without limitation: one-off "tech
              rescue" troubleshooting, ongoing home tech care and support plans, small business IT and network
              management, cybersecurity assessments and protections, device setup, data backup assistance, software
              installation and training, and AI tool setup and training. The specific scope, deliverables, and
              price for any engagement will be described in the applicable quote, invoice, service plan, or
              statement of work ("Service Order"). In the event of a conflict between a Service Order and these
              Terms, the Service Order controls with respect to the scope and pricing of that specific engagement.
            </p>

            <h2>4. Scheduling, Access, and On-Site Visits</h2>
            <ul>
              <li>We come to you. On-site visits require you (or an authorized adult) to be present, or to grant us
                explicit permission and safe access to the relevant devices, networks, and premises.</li>
              <li>You are responsible for securing pets, providing a safe working environment, and disclosing any
                known hazards prior to an on-site visit.</li>
              <li>We will make reasonable efforts to arrive within the scheduled window. Delays due to traffic,
                weather, or prior appointments running long may occur; we will communicate delays when we become
                aware of them.</li>
              <li>Rescheduling or cancellations should be made as early as possible. Repeated last-minute
                cancellations or "no access" visits may result in a trip or cancellation fee as disclosed at the
                time of booking.</li>
            </ul>

            <h2>5. Fees, Estimates, and Payment</h2>
            <ul>
              <li>Pricing is provided in advance through our published rates, a quote, or a Service Order. Estimates
                are based on the information available at the time and may change if the actual scope of work
                differs materially once we begin diagnosis.</li>
              <li>Any change in scope that will increase the estimated cost will be communicated to you before
                additional chargeable work is performed, except where immediate action is reasonably necessary to
                prevent data loss, security compromise, or further damage.</li>
              <li>Payment is due upon completion of service unless otherwise agreed in writing (for example, under a
                monthly support plan billed in advance). We accept the payment methods listed at checkout or on
                your invoice.</li>
              <li>Late payments may accrue interest at the maximum rate permitted by North Dakota law and may result
                in suspension of ongoing services, including managed IT or support plans, until the account is
                brought current.</li>
              <li>Subscription or recurring service plans renew automatically for each billing period until
                cancelled by you with reasonable advance notice as described in your plan details.</li>
            </ul>

            <h2>6. Refunds and Satisfaction</h2>
            <p>
              Because our Services generally involve labor and diagnostic time that has already been performed,
              fees for completed work are generally non-refundable. If you are not satisfied with a specific
              service visit, contact us within 7 days and we will work in good faith to make it right, which may
              include a follow-up visit at no additional charge, a partial credit, or another resolution at our
              discretion. Hardware, software licenses, or third-party products purchased through us are subject to
              the original manufacturer's or vendor's return policy.
            </p>

            <h2>7. Customer Responsibilities</h2>
            <ul>
              <li><strong>Backups.</strong> You are responsible for maintaining your own backups of important data
                before any service visit. While we take reasonable care, technology work — including software
                updates, repairs, and hardware changes — carries an inherent risk of data loss, and we are not
                liable for data loss except to the extent caused by our gross negligence or willful misconduct.</li>
              <li><strong>Accurate information.</strong> You agree to provide accurate information about your
                devices, accounts, network, and issues so that we can diagnose and resolve them effectively.</li>
              <li><strong>Legal use.</strong> You will not ask us to access, install, or configure anything for an
                unlawful purpose, including circumventing licensing restrictions or accessing accounts or devices
                you are not authorized to access.</li>
              <li><strong>Software licensing.</strong> You are responsible for maintaining valid licenses for any
                software installed or configured on your devices at your direction.</li>
            </ul>

            <h2>8. Warranties and Disclaimers</h2>
            <p>
              We warrant that Services will be performed in a professional and workmanlike manner consistent with
              generally accepted industry standards. Except for this express warranty, the Services and the Site
              are provided "as is" and "as available," and to the fullest extent permitted by law, we disclaim all
              other warranties, whether express, implied, or statutory, including implied warranties of
              merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that any
              device, network, or software will be completely free of defects, vulnerabilities, or future issues
              after our work is complete, or that any particular result (such as complete elimination of malware or
              a guaranteed increase in device speed) will be achieved.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, VYBE Technologies Inc. and its owners, employees, and
              contractors will not be liable for any indirect, incidental, special, consequential, or punitive
              damages, or any loss of data, profits, revenue, or business opportunity, arising out of or related to
              the Services or these Terms, even if we have been advised of the possibility of such damages. Our
              total aggregate liability for any claim arising out of or relating to the Services will not exceed
              the total amount you paid to us for the specific Service giving rise to the claim in the 3 months
              preceding the claim. Nothing in these Terms limits liability that cannot be limited under applicable
              law, including liability for gross negligence, willful misconduct, or death or personal injury caused
              by our negligence.
            </p>

            <h2>10. Insurance</h2>
            <p>
              VYBE Technologies Inc. is registered and insured. Proof of insurance is available upon reasonable
              request. Our insurance coverage does not extend to pre-existing conditions of your equipment,
              hardware failures unrelated to our work, or damage caused by factors outside our control (such as
              power surges, manufacturer defects, or misuse after our visit concludes).
            </p>

            <h2>11. Intellectual Property</h2>
            <p>
              The Site, including its text, graphics, logos, and software, is owned by VYBE Technologies Inc. or
              our licensors and is protected by copyright, trademark, and other intellectual property laws. You may
              not copy, reproduce, distribute, or create derivative works from the Site without our prior written
              consent, other than for personal, non-commercial reference.
            </p>

            <h2>12. Third-Party Products and Partners</h2>
            <p>
              We may recommend, resell, or configure third-party hardware, software, or services (for example,
              from technology and infrastructure partners we work with). Your use of any third-party product or
              service is subject to that provider's own terms and privacy practices, and we are not responsible for
              the acts, omissions, or policies of independent third parties.
            </p>

            <h2>13. Text Messages and Communications</h2>
            <p>
              If you provide your phone number and opt in, we may contact you by text message (SMS) about
              appointments, service updates, billing, and related account information. Message and data rates may
              apply, and you can opt out at any time. Full details on how our text messaging program works,
              including opt-in and opt-out instructions, are set out in the "Text Messaging (SMS) Communications"
              section of our{' '}
              <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by reference.
            </p>

            <h2>14. Termination</h2>
            <p>
              Either party may terminate an ongoing service plan or engagement by providing notice as described in
              the applicable Service Order. We may suspend or terminate Services immediately if you fail to pay
              amounts owed, engage in abusive or unsafe conduct toward our staff, or ask us to perform unlawful
              activity. Termination does not relieve you of the obligation to pay for Services already rendered.
            </p>

            <h2>15. Dispute Resolution and Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of North Dakota, without regard to its conflict of
              laws principles. Before filing a claim, you agree to contact us at {CONTACT.email} so we can attempt
              to resolve the issue informally. Any dispute that cannot be resolved informally will be subject to
              the exclusive jurisdiction of the state or federal courts located in Cass County, North Dakota, and
              you consent to personal jurisdiction in those courts.
            </p>

            <h2>16. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time to reflect changes in our Services, legal requirements,
              or business practices. When we make material changes, we will update the "Last updated" date above
              and, where appropriate, provide additional notice. Your continued use of the Site or Services after
              changes take effect constitutes acceptance of the updated Terms.
            </p>

            <h2>17. Severability and Entire Agreement</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in
              full force and effect. These Terms, together with any applicable Service Order and our Privacy
              Policy, constitute the entire agreement between you and VYBE Technologies Inc. regarding the Site and
              Services, and supersede any prior agreements on the same subject.
            </p>

            <h2>18. Contact Us</h2>
            <p>
              Questions about these Terms can be sent to:
              <br />
              VYBE Technologies Inc.
              <br />
              {CONTACT.addressLine1}
              <br />
              {CONTACT.addressLine2}
              <br />
              Phone: <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>
              <br />
              Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>

          </div>
        </div>
      </section>
    </>
  );
}
