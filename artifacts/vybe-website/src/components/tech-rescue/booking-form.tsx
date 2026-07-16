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
import { Paperclip, X, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';
import { SquarePaymentForm, PaymentReceipt } from '@/components/square-payment-form';

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

/** $50.00 deposit — adjust as needed */
const DEPOSIT_CENTS = 5000;

type Status = 'idle' | 'submitting' | 'success' | 'paying-deposit' | 'deposit-done' | 'error';

export function BookingForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deviceType, setDeviceType] = useState('');
  const [preferredServiceType, setPreferredServiceType] = useState('');
  const [consent, setConsent] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const { uploadFile, isUploading, error: uploadError } = useUpload();

  const apiBase =
    typeof window !== 'undefined' ? (resolveApiBaseUrl(window.location.hostname) ?? '') : '';

  // ── Success state — offer optional deposit ──────────────────────────────────

  if (status === 'paying-deposit') {
    return (
      <SquarePaymentForm
        amountCents={DEPOSIT_CENTS}
        label="Pay $50.00 deposit"
        note="Tech Rescue deposit"
        buyerEmail={submittedEmail}
        onSuccess={(url) => {
          setReceiptUrl(url);
          setStatus('deposit-done');
        }}
        onCancel={() => setStatus('success')}
      />
    );
  }

  if (status === 'deposit-done') {
    return (
      <PaymentReceipt
        receiptUrl={receiptUrl}
        onDone={() => {
          setStatus('idle');
          setReceiptUrl(null);
        }}
      />
    );
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-10 flex flex-col items-center gap-5 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        <div>
          <p className="text-emerald-400 font-medium text-lg">
            Thanks — your Tech Rescue request is in.
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            We'll review the details and reach out within one business day to confirm a time. Need
            it faster? Call us at 888-231-VYBE.
          </p>
        </div>

        {/* Optional deposit CTA */}
        <div className="w-full max-w-sm pt-2 border-t border-white/10 space-y-3">
          <p className="text-xs text-muted-foreground">
            Want to secure your slot now? Pay a refundable $50 deposit and we'll prioritise your
            booking.
          </p>
          <Button
            variant="default"
            className="w-full gap-2"
            onClick={() => setStatus('paying-deposit')}
          >
            <CreditCard size={15} />
            Pay $50 deposit with Square
          </Button>
          <Button variant="outline" className="w-full gap-1" onClick={() => setStatus('idle')}>
            Skip — submit another request
            <ArrowRight size={13} />
          </Button>
        </div>
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
    if (!message) errors.message = "Tell us what's going on.";
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
            uploadError?.message ??
              'We could not upload your photo. Try again without it, or contact us directly.',
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

      setSubmittedEmail(email);
      setStatus('success');
      form.reset();
      setDeviceType('');
      setPreferredServiceType('');
      setConsent(false);
      setPhotoFile(null);
    } catch {
      setStatus('error');
      setErrorMessage(
        'Something went wrong sending your request. Please try again or call us directly at 888-231-VYBE.',
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
              {DEVICE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.deviceType && (
            <p className="text-xs text-destructive">{fieldErrors.deviceType}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brandModel">Brand / Model</Label>
          <Input id="brandModel" name="brandModel" placeholder="e.g. Dell XPS 15" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Describe the issue</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell us what's going wrong — error messages, symptoms, how long it's been happening…"
        />
        {fieldErrors.message && <p className="text-xs text-destructive">{fieldErrors.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="preferredServiceType">Preferred Service Type</Label>
          <Select value={preferredServiceType} onValueChange={setPreferredServiceType}>
            <SelectTrigger id="preferredServiceType">
              <SelectValue placeholder="Select (optional)" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
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

      {/* Photo upload */}
      <div className="flex flex-col gap-2">
        <Label>Attach a photo (optional, max 10 MB)</Label>
        {photoFile ? (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-card px-4 py-3">
            <Paperclip size={14} className="text-muted-foreground shrink-0" />
            <span className="text-sm truncate flex-1">{photoFile.name}</span>
            <button
              type="button"
              onClick={() => setPhotoFile(null)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 px-4 py-3 cursor-pointer hover:border-primary/40 transition-colors">
            <Paperclip size={14} className="text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">Click to attach a photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > MAX_PHOTO_BYTES) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    photo: 'Photo must be under 10 MB.',
                  }));
                  return;
                }
                setFieldErrors((prev) => ({ ...prev, photo: '' }));
                setPhotoFile(file);
              }}
            />
          </label>
        )}
        {fieldErrors.photo && <p className="text-xs text-destructive">{fieldErrors.photo}</p>}
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(Boolean(v))}
        />
        <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
          I understand that submitting this form is not a confirmed appointment. VYBE Technologies
          will contact me to schedule and confirm service.
        </label>
      </div>
      {fieldErrors.consent && <p className="text-xs text-destructive">{fieldErrors.consent}</p>}

      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full py-6 text-base font-semibold">
        {submitting ? 'Sending…' : 'Submit Tech Rescue Request'}
      </Button>
    </form>
  );
}
