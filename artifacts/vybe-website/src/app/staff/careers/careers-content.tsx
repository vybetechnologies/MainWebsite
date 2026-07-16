'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  MapPin,
  Clock,
  Building2,
  BarChart2,
  Inbox,
} from 'lucide-react';
import {
  getStaffJobListings,
  createJobListing,
  updateJobListing,
  deleteJobListing,
  getStaffAnalytics,
  listBookingRequests,
} from '@workspace/api-client-react';
import type { JobListing, StaffAnalyticsResponse } from '@workspace/api-client-react';
import {
  StaffAuthGate,
  StaffPageHeader,
  StatCard,
  ServiceBadge,
} from '../staff-shell';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salaryRange: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  department: '',
  location: 'Fargo, ND',
  type: 'Full-time',
  description: '',
  requirements: '',
  salaryRange: '',
  isActive: true,
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

// ── Listing form (slide-over panel) ──────────────────────────────────────────

function ListingForm({
  initial,
  onSave,
  onClose,
  isSaving,
}: {
  initial: FormState;
  onSave: (form: FormState) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative ml-auto w-full max-w-lg h-full bg-card border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <h2 className="font-display font-semibold text-base">
            {initial.title ? 'Edit listing' : 'New listing'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Job title <span className="text-destructive">*</span>
            </label>
            <input
              ref={titleRef}
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. IT Support Technician"
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Department + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Department <span className="text-destructive">*</span>
              </label>
              <input
                required
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                placeholder="e.g. Technology"
                className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Fargo, ND"
                className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Type + Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Employment type
              </label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Salary range
              </label>
              <input
                value={form.salaryRange}
                onChange={(e) => set('salaryRange', e.target.value)}
                placeholder="e.g. $18–22/hr"
                className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the role, team, and day-to-day responsibilities…"
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Requirements{' '}
              <span className="font-normal opacity-60">(one per line)</span>
            </label>
            <textarea
              rows={4}
              value={form.requirements}
              onChange={(e) => set('requirements', e.target.value)}
              placeholder={'1+ year IT support experience\nStrong communication skills\nFargo, ND based or willing to relocate'}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set('isActive', !form.isActive)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                form.isActive ? 'bg-primary' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  form.isActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm">
              {form.isActive ? 'Visible on careers page' : 'Hidden (draft)'}
            </span>
          </label>
        </form>

        <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="listing-form"
            disabled={isSaving}
            onClick={() => {
              // Trigger the form submit via the form's onSubmit
              const form = document.querySelector<HTMLFormElement>('form');
              form?.requestSubmit();
            }}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 transition-opacity"
          >
            {isSaving ? 'Saving…' : 'Save listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Analytics summary ─────────────────────────────────────────────────────────

function CareersAnalytics() {
  const [analytics, setAnalytics] = useState<StaffAnalyticsResponse | null>(null);
  const [careerSubmissions, setCareerSubmissions] = useState<number | null>(null);

  useEffect(() => {
    getStaffAnalytics(30).then(setAnalytics).catch(() => {});
    listBookingRequests()
      .then((r) => {
        const count = r.requests.filter((req) =>
          req.service.toLowerCase().includes('career'),
        ).length;
        setCareerSubmissions(count);
      })
      .catch(() => {});
  }, []);

  const careersViews =
    analytics?.totalsByPath.find((p) => p.path === '/careers')?.totalViews ?? null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-4 flex items-center gap-2">
        <BarChart2 size={14} />
        Careers analytics (last 30 days)
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Page views"
          value={careersViews !== null ? careersViews : '—'}
          sub="/careers page"
        />
        <StatCard
          label="Interest submissions"
          value={careerSubmissions !== null ? careerSubmissions : '—'}
          sub="all time"
        />
      </div>
    </section>
  );
}

// ── Listing row ───────────────────────────────────────────────────────────────

function ListingRow({
  listing,
  onEdit,
  onToggle,
  onDelete,
}: {
  listing: JobListing;
  onEdit: (l: JobListing) => void;
  onToggle: (l: JobListing) => void;
  onDelete: (l: JobListing) => void;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-xl border px-5 py-4 transition-colors ${
        listing.isActive ? 'border-white/10 bg-card/40' : 'border-white/5 bg-card/20 opacity-60'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{listing.title}</span>
          {!listing.isActive && (
            <span className="rounded-full bg-white/10 text-muted-foreground text-xs px-2 py-0.5">
              Draft
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 size={11} />
            {listing.department}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {listing.type}
          </span>
          {listing.salaryRange && (
            <span className="text-primary">{listing.salaryRange}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          title={listing.isActive ? 'Hide listing' : 'Publish listing'}
          onClick={() => onToggle(listing)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          {listing.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button
          type="button"
          title="Edit"
          onClick={() => onEdit(listing)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          title="Delete"
          onClick={() => onDelete(listing)}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function CareersManagement() {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JobListing | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<JobListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setIsLoading(true);
    setIsError(false);
    getStaffJobListings()
      .then((r) => { setListings(r.listings); setIsLoading(false); })
      .catch(() => { setIsError(true); setIsLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (l: JobListing) => { setEditTarget(l); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleSave = async (form: FormState) => {
    setIsSaving(true);
    try {
      if (editTarget) {
        await updateJobListing(editTarget.id, form);
      } else {
        await createJobListing(form);
      }
      closeForm();
      load();
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (listing: JobListing) => {
    await updateJobListing(listing.id, { isActive: !listing.isActive });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteJobListing(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = listings.filter((l) => l.isActive).length;
  const draftCount = listings.filter((l) => !l.isActive).length;

  const initialForm: FormState = editTarget
    ? {
        title: editTarget.title,
        department: editTarget.department,
        location: editTarget.location,
        type: editTarget.type,
        description: editTarget.description,
        requirements: editTarget.requirements ?? '',
        salaryRange: editTarget.salaryRange ?? '',
        isActive: editTarget.isActive,
      }
    : EMPTY_FORM;

  return (
    <div>
      <StaffPageHeader
        title="Careers"
        description="Manage open roles and track career-page engagement."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={15} />
              New listing
            </button>
          </div>
        }
      />

      <div className="px-8 py-8 space-y-10">
        {/* Analytics */}
        <CareersAnalytics />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total listings" value={isLoading ? '—' : listings.length} />
          <StatCard label="Active" value={isLoading ? '—' : activeCount} sub="visible on site" />
          <StatCard label="Drafts" value={isLoading ? '—' : draftCount} sub="hidden" />
        </div>

        {/* Listings */}
        <section>
          <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Inbox size={14} />
            Job listings
          </h2>

          {isError && (
            <p className="text-sm text-destructive">
              Couldn&rsquo;t load listings. Check your connection and refresh.
            </p>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-card/40 animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 py-14 text-center">
              <p className="text-muted-foreground text-sm">No listings yet.</p>
              <button
                type="button"
                onClick={openNew}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Create your first listing →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {listings.map((l) => (
                <ListingRow
                  key={l.id}
                  listing={l}
                  onEdit={openEdit}
                  onToggle={handleToggle}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Slide-over form */}
      {formOpen && (
        <ListingForm
          initial={initialForm}
          onSave={handleSave}
          onClose={closeForm}
          isSaving={isSaving}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-card border border-white/10 p-6 shadow-2xl">
            <h3 className="font-display font-semibold text-base mb-2">Delete listing?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              <strong className="text-foreground">{deleteTarget.title}</strong> will be permanently
              removed from the site and can&rsquo;t be recovered.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium disabled:opacity-50 transition-opacity"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareersContent() {
  return (
    <StaffAuthGate>
      <CareersManagement />
    </StaffAuthGate>
  );
}
