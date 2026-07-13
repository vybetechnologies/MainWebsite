'use client';

import { FormEvent, ReactNode, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Reusable form shell: layout, field primitives, and submit/status states.
 * Page-level tasks (Tech Rescue booking, Contact, Careers) wire in their own
 * fields and submit handler that calls the real API.
 */
export function ContactFormShell({
  children,
  status,
  errorMessage,
  successMessage = "Thanks — we've received your message and will be in touch shortly.",
  onSubmit,
  submitLabel = 'Send Message',
}: {
  children: ReactNode;
  status: FormStatus;
  errorMessage?: string;
  successMessage?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
}) {
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-emerald-400 font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {children}
      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full">
        {status === 'submitting' ? 'Sending…' : submitLabel}
      </Button>
    </form>
  );
}

export function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function useFormStatus() {
  return useState<FormStatus>('idle');
}

export { Input, Textarea };
