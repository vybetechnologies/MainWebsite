'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Calendar,
  StickyNote,
} from 'lucide-react';
import {
  getStaffApplications,
  getStaffJobListings,
  updateApplication,
} from '@workspace/api-client-react';
import type {
  JobApplication,
  ApplicationStatus,
  JobListing,
} from '@workspace/api-client-react';
import { APPLICATION_STATUSES } from '@workspace/api-client-react';
import { StaffAuthGate, StaffPageHeader, StatCard } from '../staff-shell';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_META: Record<
  ApplicationStatus,
  { label: string; color: string; dot: string }
> = {
  new:        { label: 'New',        color: 'bg-blue-500/15 text-blue-400',   dot: 'bg-blue-400' },
  reviewing:  { label: 'Reviewing',  color: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400' },
  interview:  { label: 'Interview',  color: 'bg-purple-500/15 text-purple-400', dot: 'bg-purple-400' },
  offer:      { label: 'Offer sent', color: 'bg-cyan-500/15 text-cyan-400',   dot: 'bg-cyan-400' },
  hired:      { label: 'Hired',      color: 'bg-green-500/15 text-green-400', dot: 'bg-green-400' },
  rejected:   { label: 'Rejected',   color: 'bg-red-500/15 text-red-400',     dot: 'bg-red-400' },
  withdrawn:  { label: 'Withdrawn',  color: 'bg-white/10 text-muted-foreground', dot: 'bg-muted-foreground' },
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

// ── Expanded detail ───────────────────────────────────────────────────────────

function ExpandedDetail({
  app,
  onStatusChange,
  onNotesSave,
}: {
  app: JobApplication;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onNotesSave: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState(app.staffNotes ?? '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync notes if app changes from outside
  useEffect(() => { setNotes(app.staffNotes ?? ''); }, [app.staffNotes]);

  const scheduleNoteSave = (value: string) => {
    setNotes(value);
    setNotesSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setIsSavingNotes(true);
      onNotesSave(app.id, value);
      setTimeout(() => { setIsSavingNotes(false); setNotesSaved(true); }, 600);
    }, 1200);
  };

  const resumeApiPath = app.resumeObjectPath
    ? `/api/storage/objects${app.resumeObjectPath}`
    : null;

  return (
    <div className="px-6 py-5 bg-card/50 border-b border-white/5 space-y-6">
      {/* Contact + meta */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail size={13} className="shrink-0" />
          <a href={`mailto:${app.email}`} className="text-primary hover:underline truncate">
            {app.email}
          </a>
        </div>
        {app.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone size={13} className="shrink-0" />
            {app.phone}
          </div>
        )}
        {app.availability && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={13} className="shrink-0" />
            {app.availability}
          </div>
        )}
        {app.linkedinUrl && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Linkedin size={13} className="shrink-0" />
            <a
              href={app.linkedinUrl.startsWith('http') ? app.linkedinUrl : `https://${app.linkedinUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate flex items-center gap-1"
            >
              LinkedIn <ExternalLink size={11} />
            </a>
          </div>
        )}
        {app.portfolioUrl && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe size={13} className="shrink-0" />
            <a
              href={app.portfolioUrl.startsWith('http') ? app.portfolioUrl : `https://${app.portfolioUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate flex items-center gap-1"
            >
              Portfolio <ExternalLink size={11} />
            </a>
          </div>
        )}
        {resumeApiPath && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText size={13} className="shrink-0" />
            <a
              href={resumeApiPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Resume <ExternalLink size={11} />
            </a>
          </div>
        )}
      </div>

      {/* Cover letter */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Cover letter
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
          {app.coverLetter}
        </p>
      </div>

      {/* Status + notes side by side */}
      <div className="grid sm:grid-cols-2 gap-5 pt-1 border-t border-white/8">
        {/* Status */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Status
          </p>
          <select
            value={app.status}
            onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </div>

        {/* Staff notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <StickyNote size={11} />
              Internal notes
            </p>
            {isSavingNotes && (
              <span className="text-xs text-muted-foreground">Saving…</span>
            )}
            {notesSaved && !isSavingNotes && (
              <span className="text-xs text-green-400">Saved</span>
            )}
          </div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => scheduleNoteSave(e.target.value)}
            placeholder="Add private notes about this candidate…"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

// ── Application row ───────────────────────────────────────────────────────────

function ApplicationRow({
  app,
  expanded,
  onToggle,
  onStatusChange,
  onNotesSave,
}: {
  app: JobApplication;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onNotesSave: (id: string, notes: string) => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer hover:bg-card/40 transition-colors align-middle"
      >
        <td className="px-4 py-3 text-muted-foreground w-8">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <p className="font-medium text-sm">{app.firstName} {app.lastName}</p>
          <p className="text-xs text-muted-foreground">{app.email}</p>
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap hidden sm:table-cell">
          {app.jobListingTitle}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={app.status as ApplicationStatus} />
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap hidden md:table-cell">
          {formatDateTime(app.createdAt)}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="p-0">
            <ExpandedDetail
              app={app}
              onStatusChange={onStatusChange}
              onNotesSave={onNotesSave}
            />
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Interview', value: 'interview' },
  { label: 'Offer', value: 'offer' },
  { label: 'Hired', value: 'hired' },
  { label: 'Rejected', value: 'rejected' },
];

function ApplicationsTable() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    Promise.all([
      getStaffApplications(),
      getStaffJobListings(),
    ])
      .then(([appsRes, listingsRes]) => {
        setApplications(appsRes.applications);
        setListings(listingsRes.listings);
        setIsLoading(false);
      })
      .catch(() => { setIsError(true); setIsLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplication(id, { status });
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  };

  const handleNotesSave = async (id: string, staffNotes: string) => {
    await updateApplication(id, { staffNotes });
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, staffNotes } : a)),
    );
  };

  const filtered = applications.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (jobFilter !== 'all' && a.jobListingId !== jobFilter) return false;
    return true;
  });

  // Stats
  const newCount = applications.filter((a) => a.status === 'new').length;
  const activeCount = applications.filter((a) =>
    ['reviewing', 'interview', 'offer'].includes(a.status),
  ).length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  return (
    <div>
      <StaffPageHeader
        title="Applications"
        description={`${filtered.length} of ${applications.length} applications`}
        action={
          <button
            type="button"
            onClick={load}
            disabled={isLoading}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      <div className="px-8 py-8 space-y-7">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={isLoading ? '—' : applications.length} />
          <StatCard label="New / unread" value={isLoading ? '—' : newCount} />
          <StatCard label="In progress" value={isLoading ? '—' : activeCount} sub="reviewing · interview · offer" />
          <StatCard label="Hired" value={isLoading ? '—' : hiredCount} />
        </div>

        {isError && (
          <p className="text-sm text-destructive">
            Couldn&rsquo;t load applications. Check your connection and refresh.
          </p>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Status tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_TABS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setStatusFilter(value); setExpandedId(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/60 border border-white/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
                {value !== 'all' && (
                  <span className="ml-1.5 opacity-60">
                    {applications.filter((a) => a.status === value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Job filter */}
          {listings.length > 0 && (
            <select
              value={jobFilter}
              onChange={(e) => { setJobFilter(e.target.value); setExpandedId(null); }}
              className="rounded-lg border border-white/10 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground focus:outline-none focus:border-primary/50 sm:ml-auto"
            >
              <option value="all">All positions</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-card/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 py-14 text-center">
            <p className="text-muted-foreground text-sm">
              {applications.length === 0
                ? 'No applications yet. Share your open roles!'
                : 'No applications match this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-card/80 border-b border-white/10 text-left">
                <tr>
                  <th className="px-4 py-3 w-8" />
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Candidate</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Position</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    expanded={expandedId === app.id}
                    onToggle={() => setExpandedId((p) => (p === app.id ? null : app.id))}
                    onStatusChange={handleStatusChange}
                    onNotesSave={handleNotesSave}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationsContent() {
  return (
    <StaffAuthGate>
      <ApplicationsTable />
    </StaffAuthGate>
  );
}
