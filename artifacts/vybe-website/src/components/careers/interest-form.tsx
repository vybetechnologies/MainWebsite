'use client';

import { FormEvent, useState } from 'react';
import { createBookingRequest, setBaseUrl } from '@workspace/api-client-react';
import { resolveApiBaseUrl } from '@/lib/api-base';
import {
  ContactFormShell,
  FormField,
  Input,
  Textarea,
  useFormStatus,
} from '@/components/shared/contact-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AREAS_OF_INTEREST = [
  'Technology Services',
  'Software Engineering',
  'Business Operations',
  'Customer Support',
  'Sales & Partnerships',
  'Other',
];

export function CareersInterestForm() {
  const [status, setStatus] = useFormStatus();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [areaOfInterest, setAreaOfInterest] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(undefined);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!firstName || !lastName || !email || !message) {
      setErrorMessage('Please fill out your name, email, and a short message.');
      return;
    }

    setStatus('submitting');
    try {
      setBaseUrl(resolveApiBaseUrl(window.location.hostname));
      await createBookingRequest({
        firstName,
        lastName,
        email,
        ...(phone ? { phone } : {}),
        service: `Careers — ${areaOfInterest || 'General Interest'}`,
        message,
      });
      setStatus('success');
      form.reset();
      setAreaOfInterest('');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong sending your message. Please try again or email us directly.');
    }
  };

  return (
    <ContactFormShell
      status={status}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      submitLabel="Submit Interest"
      successMessage="Thanks for reaching out — we'll keep your information on file and follow up if there's a fit."
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <FormField id="firstName" label="First Name">
          <Input id="firstName" name="firstName" required placeholder="Jane" />
        </FormField>
        <FormField id="lastName" label="Last Name">
          <Input id="lastName" name="lastName" required placeholder="Doe" />
        </FormField>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <FormField id="email" label="Email">
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        </FormField>
        <FormField id="phone" label="Phone (optional)">
          <Input id="phone" name="phone" type="tel" placeholder="(701) 555-0134" />
        </FormField>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="areaOfInterest">Area of Interest</Label>
        <Select value={areaOfInterest} onValueChange={setAreaOfInterest}>
          <SelectTrigger id="areaOfInterest">
            <SelectValue placeholder="What kind of role interests you?" />
          </SelectTrigger>
          <SelectContent>
            {AREAS_OF_INTEREST.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FormField id="message" label="Tell us about yourself">
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Share your background and what you're looking for."
        />
      </FormField>
    </ContactFormShell>
  );
}
