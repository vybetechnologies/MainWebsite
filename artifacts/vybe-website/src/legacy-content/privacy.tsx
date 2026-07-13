import { SEO } from '@/components/seo';
import { CONTACT } from '@/lib/contact-info';

const LAST_UPDATED = 'July 12, 2026';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How VYBE Technologies Inc. collects, uses, and protects your information, including our text message (SMS) opt-in and opt-out program."
      />

      <section className="pt-32 pb-16 border-b border-border bg-card/30">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto prose prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">

            <p>
              VYBE Technologies Inc. ("VYBE," "we," "us," or "our") respects your privacy. This Privacy Policy
              explains what information we collect, how we use and share it, the choices you have, and how we
              protect it, when you visit vybetechnologies.net (the "Site") or use our technology support services
              (the "Services"). By using the Site or Services, you acknowledge the practices described here. If you
              have questions, contact us at {CONTACT.email} or {CONTACT.phoneDisplay}.
            </p>

            <h2>1. Information We Collect</h2>
            <h3>1.1 Information You Provide to Us</h3>
            <ul>
              <li><strong>Contact details</strong> — name, mailing address, email address, and phone number, such as
                when you fill out our contact form, request a quote, or book a service.</li>
              <li><strong>Account and billing information</strong> — details needed to schedule, invoice, and
                collect payment for services, including payment method information processed through our payment
                processor (we do not store full card numbers on our own systems).</li>
              <li><strong>Service details</strong> — descriptions of the technology issues you report, notes taken
                during service visits, device information, and any credentials or access you voluntarily provide so
                we can perform the requested work.</li>
              <li><strong>Communications</strong> — records of calls, emails, text messages, and chat messages
                between you and VYBE, including any voicemails or messages you leave for us.</li>
            </ul>

            <h3>1.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Device and usage data</strong> — IP address, browser type, device type, pages viewed,
                referring/exit pages, and timestamps, collected when you use the Site.</li>
              <li><strong>Cookies and similar technologies</strong> — small data files used to remember preferences,
                understand how visitors use the Site, and measure the effectiveness of our content. You can control
                cookies through your browser settings; disabling cookies may limit some Site functionality.</li>
              <li><strong>Analytics</strong> — we may use third-party analytics tools to understand aggregate Site
                traffic and usage patterns. These tools may use cookies or similar technology on our behalf.</li>
            </ul>

            <h3>1.3 Information From Other Sources</h3>
            <p>
              We may receive information about you from technology and infrastructure partners we work with (see
              Section 6), from public sources, or from referrals — for example, if a friend or family member
              refers you to us and provides your contact information so we can reach out about scheduling service.
            </p>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To schedule, perform, and follow up on the Services you request, including on-site and remote
                tech support.</li>
              <li>To communicate with you about appointments, quotes, invoices, and account matters, by phone,
                email, or text message (see Section 5 for our SMS program specifically).</li>
              <li>To process payments and maintain accurate business and tax records.</li>
              <li>To improve our Site, Services, and customer experience, including troubleshooting and diagnosing
                recurring issues.</li>
              <li>To send you information about additional services, seasonal offers, or maintenance reminders,
                where you have not opted out of such communications.</li>
              <li>To detect, investigate, and prevent fraud, unauthorized access, or activity that violates our
                Terms of Service.</li>
              <li>To comply with legal obligations, respond to lawful requests from public authorities, and enforce
                our agreements.</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share information in the following circumstances:</p>
            <ul>
              <li><strong>Service providers.</strong> With vendors who perform functions on our behalf, such as
                payment processing, scheduling software, hosting, and communications tools, bound by confidentiality
                and data protection obligations appropriate to the service they provide.</li>
              <li><strong>Technology partners.</strong> Where a specific engagement requires it (for example,
                licensing software or provisioning a cloud account through one of our technology partners), we may
                share the minimum information necessary to complete that setup on your behalf, with your knowledge.</li>
              <li><strong>Legal and safety reasons.</strong> When required by law, subpoena, or court order, or when
                we believe in good faith that disclosure is necessary to protect the rights, property, or safety of
                VYBE, our customers, or the public.</li>
              <li><strong>Business transfers.</strong> In connection with a merger, acquisition, financing, or sale
                of business assets, in which case your information may be transferred as part of that transaction,
                subject to standard confidentiality protections.</li>
              <li><strong>With your consent.</strong> For any other purpose disclosed to you at the time we collect
                the information, or with your consent.</li>
            </ul>
            <p>
              <strong>Text messaging opt-in data and consent are never shared with third parties for their
              marketing purposes.</strong> See Section 5 below for details specific to our SMS program.
            </p>

            <h2>4. Data Retention and Security</h2>
            <p>
              We retain personal information for as long as needed to provide the Services, maintain business and
              tax records, resolve disputes, and comply with legal obligations, after which we securely delete or
              anonymize it. We use administrative, technical, and physical safeguards designed to protect your
              information, including access controls, encrypted connections for data in transit where applicable,
              and limiting access to personal information to personnel who need it to do their jobs. No method of
              transmission or storage is 100% secure, and we cannot guarantee absolute security, but we work to
              apply the same security discipline to our own systems that we recommend to our clients.
            </p>

            <h2>5. Text Messaging (SMS) Communications</h2>
            <p>
              VYBE Technologies Inc. offers an optional text messaging (SMS) program to help keep you informed
              about your service appointments and account. This section explains exactly how the program works,
              including how to opt in and opt out.
            </p>

            <h3>5.1 What We Text You About</h3>
            <p>Depending on what you sign up for, text messages from VYBE may include:</p>
            <ul>
              <li>Appointment confirmations, reminders, and technician "on the way" notifications.</li>
              <li>Updates on the status of an in-progress repair or service ticket.</li>
              <li>Billing and payment notifications, such as invoice reminders or receipt confirmations.</li>
              <li>Occasional service reminders or relevant offers (for example, a seasonal maintenance check-in),
                only if you have separately opted in to marketing messages.</li>
            </ul>
            <p>
              We do not use text messaging to request sensitive information such as passwords, full payment card
              numbers, or Social Security numbers. We will never ask you to complete a purchase solely by replying
              to a text with financial details.
            </p>

            <h3>5.2 How You Opt In</h3>
            <p>You may opt in to receive text messages from VYBE in any of the following ways:</p>
            <ul>
              <li><strong>Online forms.</strong> By checking the SMS consent checkbox on our contact, booking, or
                quote request forms and submitting your mobile number.</li>
              <li><strong>Verbally, over the phone.</strong> By providing your mobile number and affirmatively
                agreeing to receive texts when speaking with our team, for example while scheduling an appointment.</li>
              <li><strong>In person.</strong> By providing your mobile number and consent on a service intake form
                during an on-site visit.</li>
              <li><strong>By texting us first.</strong> If you initiate a text conversation with our published
                business number, we treat that as consent to text you back regarding that inquiry.</li>
            </ul>
            <p>
              Consent to receive text messages is never a condition of purchasing any service from us. You can
              always choose to be contacted only by phone call or email instead.
            </p>
            <p>
              By opting in, you confirm that you are the account holder or authorized user for the mobile number
              provided, and you agree to receive automated and/or manually sent text messages from VYBE
              Technologies Inc. at that number. <strong>Message frequency varies</strong> based on your appointments
              and account activity. <strong>Message and data rates may apply</strong> based on your mobile carrier
              and plan. Carriers are not liable for delayed or undelivered messages.
            </p>

            <h3>5.3 How You Opt Out</h3>
            <p>You can opt out of text messages from VYBE at any time, using any of these methods:</p>
            <ul>
              <li><strong>Reply STOP.</strong> Reply <strong>STOP</strong>, <strong>STOPALL</strong>,{' '}
                <strong>UNSUBSCRIBE</strong>, <strong>CANCEL</strong>, <strong>END</strong>, or{' '}
                <strong>QUIT</strong> to any text message you receive from us. You will get one final confirmation
                message letting you know you have been unsubscribed, and you will not receive further texts from
                that program unless you opt back in.</li>
              <li><strong>Contact us directly.</strong> Call us at {CONTACT.phoneDisplay} or email{' '}
                {CONTACT.email} and ask to be removed from text communications. We will process your request
                without unreasonable delay.</li>
              <li><strong>Tell your technician.</strong> Let any VYBE team member know in person or over the phone
                that you'd like to stop receiving texts, and we will update your preferences.</li>
            </ul>
            <p>
              If you opt out, we may still need to contact you by phone or email regarding an active appointment or
              open invoice, since opting out of text messages does not opt you out of necessary service
              communications sent through other channels.
            </p>

            <h3>5.4 Getting Help</h3>
            <p>
              Reply <strong>HELP</strong> to any text message from us for assistance, or contact{' '}
              {CONTACT.email} / {CONTACT.phoneDisplay} directly. For support with the messaging program itself, you
              can also reach our team during normal business hours.
            </p>

            <h3>5.5 Supported Carriers and Limitations</h3>
            <p>
              Our text program is intended to work with most major U.S. mobile carriers. Carriers are not
              responsible for delayed or undelivered messages. Message delivery is subject to effective
              transmission from your network provider, and we are not liable for messages that are not received
              due to carrier issues, an incorrect number on file, or your device settings.
            </p>

            <h3>5.6 No Sharing of SMS Opt-In Data</h3>
            <p>
              Your phone number and SMS consent status, collected for this messaging program, will not be shared or
              sold to any third party or affiliate for their own marketing or promotional purposes. Your mobile
              information is used solely to send you the text messages described above and is not shared with
              third parties for their unrelated marketing purposes.
            </p>

            <h2>6. Technology Partners</h2>
            <p>
              We work with a number of established technology providers to deliver reliable, secure services,
              including infrastructure, security, and distribution partners such as Microsoft, Google, Cloudflare,
              Fly.io, Neon, Pax8, MobileSentrix, and Grasshopper. When a service you request runs through one of
              these platforms (for example, setting up a business email account or provisioning secure hosting),
              your relevant information may be processed by that partner under their own privacy policy and terms,
              in addition to this Privacy Policy. We select partners that we believe maintain appropriate security
              and privacy standards, but we encourage you to review their policies if you have specific concerns.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our Services are intended for individuals who are at least 18 years old, or of the age of majority in
              their jurisdiction, and businesses. We do not knowingly collect personal information from children
              under 13. If we learn that we have inadvertently collected such information, we will delete it
              promptly. Parents or guardians who believe their child has provided us with personal information
              should contact us at {CONTACT.email}.
            </p>

            <h2>8. Your Choices and Rights</h2>
            <ul>
              <li><strong>Access and correction.</strong> You may ask us to provide a copy of the personal
                information we hold about you, or to correct inaccurate information, by contacting us.</li>
              <li><strong>Deletion.</strong> You may request that we delete personal information we hold about you,
                subject to our need to retain certain records for legal, tax, accounting, or dispute-resolution
                purposes.</li>
              <li><strong>Marketing communications.</strong> You can opt out of promotional emails at any time using
                the unsubscribe link in those emails, and opt out of promotional texts as described in Section 5.3.</li>
              <li><strong>Cookies.</strong> You can manage or disable cookies through your browser settings at any
                time, as described in Section 1.2.</li>
              <li><strong>Do Not Track.</strong> Our Site does not currently respond to browser "Do Not Track"
                signals, as there is no common industry standard for how to interpret them.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at {CONTACT.email} or {CONTACT.phoneDisplay}. We will
              verify your request and respond within a reasonable timeframe consistent with applicable law.
            </p>

            <h2>9. State-Specific Privacy Rights</h2>
            <p>
              Depending on where you live, you may have additional rights under state privacy laws (for example,
              laws in California, Virginia, Colorado, Connecticut, and other states that have enacted comprehensive
              privacy statutes), including the right to know what personal information we have collected about you,
              the right to request deletion, and the right to non-discrimination for exercising your privacy
              rights. We do not sell personal information and do not use it for cross-context behavioral
              advertising in a manner that would require an opt-out mechanism under these laws. If you believe a
              specific state law grants you a right not otherwise described here, please contact us and we will
              evaluate your request under the applicable law.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites, including the sites of our technology partners.
              We are not responsible for the privacy practices or content of those third-party sites. We encourage
              you to review the privacy policy of any site you visit.
            </p>

            <h2>11. International Users</h2>
            <p>
              Our Services are directed at customers located in the United States, specifically the Fargo, North
              Dakota area and surrounding communities. If you access the Site from outside the United States, your
              information will be transferred to and processed in the United States, which may have different data
              protection laws than your home country.
            </p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements, or for other operational reasons. We will update the "Last updated" date above
              when we make changes, and for material changes affecting how we handle text messaging consent or
              other significant practices, we will provide additional notice where appropriate. We encourage you to
              review this page periodically.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, our text messaging program, or how we handle your
              information, please contact us:
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
