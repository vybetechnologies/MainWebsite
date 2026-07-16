'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { FileText, Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import { resolveApiBaseUrl } from '@/lib/api-base';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Application {
  id: string;
  jobListingTitle: string;
  status: string;
  createdAt: string;
  firstName: string;
  lastName: string;
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-blue-500/15 text-blue-400',
  reviewing: 'bg-amber-500/15 text-amber-400',
  interview: 'bg-purple-500/15 text-purple-400',
  offer:     'bg-cyan-500/15 text-cyan-400',
  hired:     'bg-green-500/15 text-green-400',
  rejected:  'bg-red-500/15 text-red-400',
  withdrawn: 'bg-white/10 text-muted-foreground',
};

const STATUS_LABELS: Record<string, string> = {
  new:       'Under review',
  reviewing: 'Reviewing',
  interview: 'Interview',
  offer:     'Offer received',
  hired:     'Hired 🎉',
  rejected:  'Not selected',
  withdrawn: 'Withdrawn',
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? 'bg-white/10 text-muted-foreground';
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 flex flex-col items-center gap-4 py-16 text-center px-6">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <FileText size={20} className="text-primary" />
      </div>
      <div>
        <p className="font-medium">No applications yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Apply for open positions on the careers page.
        </p>
      </div>
      <Link
        href="/careers#open-roles"
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Plus size={14} />
        View open roles
      </Link>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ApplicationsContent() {
  const { user, isLoaded } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) { setLoading(false); return; }

    const base = resolveApiBaseUrl(window.location.hostname) ?? '';
    fetch(`${base}/api/account/applications?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => { setApplications(data.applications ?? []); setLoading(false); })
      .catch(() => { setError('Could not load applications.'); setLoading(false); });
  }, [isLoaded, user]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track the status of every position you have applied for.
          </p>
        </div>
        <Link
          href="/careers"
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Plus size={14} />
          View roles
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : applications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-white/10 bg-card px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <p className="font-medium text-sm truncate">{a.jobListingTitle}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={11} />
                  Applied {formatDate(a.createdAt)}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      )}

      {applications.length > 0 && (
        <p className="text-xs text-muted-foreground pt-2">
          Status updates reflect decisions made by VYBE staff. We review every application personally.
        </p>
      )}
    </div>
  );
}
