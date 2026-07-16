'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Upload, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { submitApplication, requestUploadUrl, setBaseUrl } from '@workspace/api-client-react';
import type { JobListing } from '@workspace/api-client-react';
import { resolveApiBaseUrl } from '@/lib/api-base';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACCEPTED_RESUME_TYPES = '.pdf,.doc,.docx';
const MAX_RESUME_BYTES = 10 * 1024 * 1024; // 10 MB

async function uploadResume(file: File): Promise<string> {
  const { uploadURL, objectPath } = await requestUploadUrl({
    name: file.name,
    size: file.size,
    contentType: file.type || 'application/octet-stream',
  });
  const put = await fetch(uploadURL, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
  });
  if (!put.ok) throw new Error('Resume upload failed');
  return objectPath;
}

// ── Field primitives ──────────────────────────────────────────────────────────

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-muted-foreground mb-1.5">
      {children}
      {optional && <span className="ml-1 font-normal opacity-60">(optional)</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none disabled:opacity-50"
    />
  );
}

// ── Resume upload field ───────────────────────────────────────────────────────

function ResumeUploadField({
  file,
  onFile,
  isUploading,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  isUploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_RESUME_BYTES) {
      alert('Resume must be under 10 MB.');
      return;
    }
    onFile(f);
  };

  return (
    <div>
      <Label htmlFor="resume" optional>Resume</Label>
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 cursor-pointer transition-colors ${
          file
            ? 'border-primary/40 bg-primary/5'
            : 'border-white/15 hover:border-white/30 hover:bg-white/3'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Upload size={15} className="shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          {file ? (
            <span className="text-sm truncate">{file.name}</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Click to upload PDF, DOC, or DOCX — max 10 MB
            </span>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFile(null); if (inputRef.current) inputRef.current.value = ''; }}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        )}
        <input
          ref={inputRef}
          id="resume"
          type="file"
          accept={ACCEPTED_RESUME_TYPES}
          className="sr-only"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface ApplicationModalProps {
  listing: JobListing;
  onClose: () => void;
}

type Stage = 'form' | 'submitting' | 'success';

export function ApplicationModal({ listing, onClose }: ApplicationModalProps) {
  const [stage, setStage] = useState<Stage>('form');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStage('submitting');

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '').trim();

    try {
      setBaseUrl(resolveApiBaseUrl(window.location.hostname));

      // Upload resume if provided
      let resumeObjectPath: string | undefined;
      if (resumeFile) {
        setIsUploadingResume(true);
        resumeObjectPath = await uploadResume(resumeFile);
        setIsUploadingResume(false);
      }

      await submitApplication({
        jobListingId: listing.id,
        jobListingTitle: listing.title,
        firstName: get('firstName'),
        lastName: get('lastName'),
        email: get('email'),
        ...(get('phone') ? { phone: get('phone') } : {}),
        coverLetter: get('coverLetter'),
        ...(resumeObjectPath ? { resumeObjectPath } : {}),
        ...(get('linkedinUrl') ? { linkedinUrl: get('linkedinUrl') } : {}),
        ...(get('portfolioUrl') ? { portfolioUrl: get('portfolioUrl') } : {}),
        ...(get('availability') ? { availability: get('availability') } : {}),
      });

      setStage('success');
    } catch (err) {
      setIsUploadingResume(false);
      setStage('form');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }, [listing, resumeFile]);

  const isSubmitting = stage === 'submitting';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:items-center sm:justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl max-h-[90dvh] flex flex-col rounded-2xl border border-white/10 bg-card shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="shrink-0 px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              Applying for
            </p>
            <h2 className="font-display font-semibold text-base leading-snug">{listing.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {listing.department} · {listing.location} · {listing.type}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {stage === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Application submitted!</h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Thanks for applying to <strong className="text-foreground">{listing.title}</strong>.
                We review every application and will be in touch if there&rsquo;s a fit.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" required placeholder="Jane" disabled={isSubmitting} />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" required placeholder="Doe" disabled={isSubmitting} />
              </div>
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="jane@example.com" disabled={isSubmitting} />
              </div>
              <div>
                <Label htmlFor="phone" optional>Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(701) 555-0134" disabled={isSubmitting} />
              </div>
            </div>

            {/* Cover letter */}
            <div>
              <Label htmlFor="coverLetter">Cover letter</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                rows={5}
                required
                placeholder="Tell us why you're a great fit for this role and what excites you about working at VYBE…"
                disabled={isSubmitting}
              />
            </div>

            {/* Resume */}
            <ResumeUploadField
              file={resumeFile}
              onFile={setResumeFile}
              isUploading={isUploadingResume}
            />

            {/* LinkedIn + Portfolio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedinUrl" optional>LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  placeholder="linkedin.com/in/jane"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="portfolioUrl" optional>Portfolio / Website</Label>
                <Input
                  id="portfolioUrl"
                  name="portfolioUrl"
                  type="url"
                  placeholder="janedoe.dev"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label htmlFor="availability" optional>Availability</Label>
              <Input
                id="availability"
                name="availability"
                placeholder="e.g. Available immediately, 2-week notice, starting Aug 2026"
                disabled={isSubmitting}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-4 py-2.5">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="pt-1 flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Your information is kept private and only shared with VYBE staff.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60 transition-opacity"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                {isSubmitting
                  ? isUploadingResume
                    ? 'Uploading resume…'
                    : 'Submitting…'
                  : 'Submit application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
