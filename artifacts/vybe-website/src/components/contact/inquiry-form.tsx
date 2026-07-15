'use client';

import { FormEvent, useState } from 'react';
import {
  HelpCircle,
  LifeBuoy,
  Briefcase,
  Handshake,
  Newspaper,
  UserPlus,
  Scale,
  type LucideIcon,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

export interface InquiryPath {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const INQUIRY_PATHS: InquiryPath[] = [
  {
    value: 'General Inquiries',
    label: 'General Inquiries',
    description: 'Not sure where to start? Send it here.',
    icon: HelpCircle,
  },
  {
    value: 'Customer Support',
    label: 'Customer Support',
    description: 'Help with an existing repair, product, or account.',
    icon: LifeBuoy,
  },
  {
    value: 'Business Sales',
    label: 'Business Sales',
    description: 'Managed IT, business technology, and bulk orders.',
    icon: Briefcase,
  },
  {
    value: 'Partnerships',
    label: 'Partnerships',
    description: 'Community, reseller, and partnership opportunities.',
    icon: Handshake,
  },
  {
    value: 'Press',
    label: 'Press',
    description: 'Media inquiries and interview requests.',
    icon: Newspaper,
  },
  {
    value: 'Careers',
    label: 'Careers',
    description: "Interested in joining VYBE? Visit our careers page.",
    icon: UserPlus,
  },
  {
    value: 'Legal',
    label: 'Legal',
    description: 'Legal, compliance, and privacy questions.',
    icon: Scale,
  },
];

export function InquiryPathGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {INQUIRY_PATHS.map((path) => {
        const Icon = path.icon;
        const isActive = selected === path.value;
        return (
          <button
            key={path.value}
            type="button"
            onClick={() => onSelect(path.value)}
            aria-pressed={isActive}
            className={cn(
              'flex flex-col gap-3 rounded-2xl border p-5 text-left transition-colors',
              isActive
                ? 'border-primary bg-primary/10'
                : 'border-card-border bg-card hover:border-primary/40',
            )}
          >
            <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-secondary')} />
            <span className="font-display font-semibold">{path.label}</span>
            <span className="text-sm text-muted-foreground leading-relaxed">
              {path.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function InquiryForm({
  inquiryType,
  onInquiryTypeChange,
}: {
  inquiryType: string;
  onInquiryTypeChange: (value: string) => void;
}) {
  const [status, setStatus] = useFormStatus();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

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

    if (!firstName || !lastName || !email || !message || !inquiryType) {
      setErrorMessage('Please choose an inquiry type and fill out all required fields.');
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
        service: inquiryType,
        message,
      });
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMessage(
        'Something went wrong sending your message. Please try again or call us directly.',
      );
    }
  };

  return (
    <ContactFormShell status={status} errorMessage={errorMessage} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="inquiryType">Inquiry Type</Label>
        <Select value={inquiryType} onValueChange={onInquiryTypeChange}>
          <SelectTrigger id="inquiryType">
            <SelectValue placeholder="Select an inquiry type" />
          </SelectTrigger>
          <SelectContent>
            {INQUIRY_PATHS.map((path) => (
              <SelectItem key={path.value} value={path.value}>
                {path.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
      <FormField id="message" label="Message">
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="How can we help?"
        />
      </FormField>
    </ContactFormShell>
  );
}
