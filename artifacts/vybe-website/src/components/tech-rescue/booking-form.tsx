'use client';

import { FormEvent, useState } from 'react';
import { createBookingRequest, setBaseUrl } from '@workspace/api-client-react';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { useUpload } from '@workspace/object-storage-web';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Paperclip, X, CheckCircle2 } from 'lucide-react';

const DEVICE_TYPES = [
  'Computer',
  'Phone or Tablet',
  'Gaming Device',
  'Home Technology',
  'Business Technology',
  'Other',
];

const SERVICE_TYPES = ['On-Site Support', 'Drop-Off Repair', 'Remote Support'];

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function BookingForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deviceType, setDeviceType] = useState('');
  const [preferredServiceType, setPreferredServiceType] = useState('');
  const [consent, setConsent] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { uploadFile, isUploading, error: uploadError } = useUpload();

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center flex flex-col items-center gap-4">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        <p className="text-emerald-400 font-medium text-lg">
          Thanks — your Tech Rescue request is in.
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
          We'll review the details and reach out within one business day to confirm a time. Need
          it faster? Call us directly at 888-231-VYBE.
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Submit another request
        </Button>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const brandModel = String(formData.get('brandModel') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const preferredDate = String(formData.get('preferredDate') ?? '').trim();

    const errors: Record<string, string> = {};
    if (!firstName) errors.firstName = 'First name is required.';
    if (!lastName) errors.lastName = 'Last name is required.';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!deviceType) errors.deviceType = 'Select a device type.';
    if (!message) errors.message = 'Tell us what\'s going on.';
    if (!consent) errors.consent = 'Please confirm before submitting.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus('submitting');

    try {
      let photoObjectPath: string | undefined;
      if (photoFile) {
        const uploadResult = await uploadFile(photoFile);
        if (!uploadResult) {
          setStatus('error');
          setErrorMessage(
            uploadError?.message ?? 'We could not upload your photo. Try again without it, or contact us directly.',
          );
          return;
        }
        photoObjectPath = uploadResult.objectPath;
      }

      setBaseUrl(resolveApiBaseUrl(window.location.hostname));
      await createBookingRequest({
        firstName,
        lastName,
        email,
        ...(phone ? { phone } : {}),
        service: deviceType,
        message,
        deviceType,
        ...(brandModel ? { brandModel } : {}),
        ...(preferredServiceType ? { preferredServiceType } : {}),
        ...(preferredDate ? { preferredDate } : {}),
        ...(photoObjectPath ? { photoObjectPath } : {}),
      });

      setStatus('success');
      form.reset();
      setDeviceType('');
      setPreferredServiceType('');
      setConsent(false);
      setPhotoFile(null);
    } catch {
      setStatus('error');
      setErrorMessage(
        "Something went wrong sending your request. Please try again or call us directly at 888-231-VYBE.",
      );
    }
  };

  const submitting = status === 'submitting' || isUploading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" required placeholder="Jane" />
          {fieldErrors.firstName && (
            <p className="text-xs text-destructive">{fieldErrors.firstName}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" required placeholder="Doe" />
          {fieldErrors.lastName && (
            <p className="text-xs text-destructive">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="(701) 555-0134" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="deviceType">Device Type</Label>
          <Select value={deviceType} onValueChange={setDeviceType}>
            <SelectTrigger id="deviceType">
              <SelectValue placeholder="Select a device type" />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.deviceType && (
            <p className="text-xs text-destructive">{fieldErrors.deviceType}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brandModel">Brand & Model</Label>
          <Input id="brandModel" name="brandModel" placeholder="e.g. Dell XPS 13" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">What's going on?</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Describe the problem — error messages, when it started, anything that helps us prep."
        />
        {fieldErrors.message && <p className="text-xs text-destructive">{fieldErrors.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="preferredServiceType">Preferred Service Type</Label>
          <Select value={preferredServiceType} onValueChange={setPreferredServiceType}>
            <SelectTrigger id="preferredServiceType">
              <SelectValue placeholder="How should we help?" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="preferredDate">Preferred Date</Label>
          <Input id="preferredDate" name="preferredDate" type="date" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="photo">Photo (optional)</Label>
        {photoFile ? (
          <div className="flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm">
            <span className="truncate">{photoFile.name}</span>
            <button
              type="button"
              onClick={() => setPhotoFile(null)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="photo"
            className="flex items-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-foreground transition-colors"
          >
            <Paperclip className="h-4 w-4" />
            Attach a photo of the issue
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > MAX_PHOTO_BYTES) {
                  setErrorMessage('Photo must be smaller than 10MB.');
                  return;
                }
                setErrorMessage(null);
                setPhotoFile(file);
              }}
            />
          </label>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          className="mt-0.5"
        />
        <div>
          <Label htmlFor="consent" className="font-normal leading-snug">
            I consent to be contacted about this repair request by phone, text, or email.
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            We only use your information to schedule and complete your service. We never sell your
            data. See our{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              privacy policy
            </a>{' '}
            for details.
          </p>
        </div>
      </div>
      {fieldErrors.consent && <p className="text-xs text-destructive">{fieldErrors.consent}</p>}

      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? 'Sending…' : 'Start a Repair'}
      </Button>
    </form>
  );
}
