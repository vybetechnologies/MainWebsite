'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Inbox, BarChart2, RefreshCw } from 'lucide-react';
import { listBookingRequests } from '@workspace/api-client-react';
import type { BookingRequestRecord } from '@workspace/api-client-react';
import {
  StaffAuthGate,
  StaffPageHeader,
  StatCard,
  ServiceBadge,
} from './staff-shell';

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoWeekAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const POLL_INTERVAL_MS = 30_000;

/** Returns the newest createdAt ISO string among a list, or '' if empty. */
function newestAt(items: BookingRequestRecord[]): string {
  return items.reduce((acc, r) => (r.createdAt > acc ? r.createdAt : acc), '');
}

// ── Overview content ──────────────────────────────────────────────────────────

function OverviewContent() {
  const [requests, setRequests] = useState<BookingRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [newCount, setNewCount] = useState(0);

  // Tracks the newest createdAt that staff have actually seen.
  const seenLatestAtRef = useRef<string>('');

  const applyResults = (items: BookingRequestRecord[]) => {
    setRequests(items);
    seenLatestAtRef.current = newestAt(items);
    setNewCount(0);
  };

  const load = () => {
    setIsLoading(true);
    setIsError(false);
    listBookingRequests()
      .then((r) => {
        applyResults(r.requests);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  };

  // Silent background poll — does not touch isLoading so stats stay visible.
  const poll = () => {
    listBookingRequests()
      .then((r) => {
        const latest = newestAt(r.requests);
        if (latest && latest > seenLatestAtRef.current) {
          const count = r.requests.filter((x) => x.createdAt > seenLatestAtRef.current).length;
          setNewCount(count);
        }
      })
      .catch(() => {
        // Silently ignore poll errors — don't disturb the UI.
      });
  };

  useEffect(() => {
    load();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = isoToday();
  const weekAgo = isoWeekAgo();

  const totalCount = requests.length;
  const todayCount = requests.filter((r) => r.createdAt.slice(0, 10) === today).length;
  const weekCount = requests.filter((r) => r.createdAt.slice(0, 10) >= weekAgo).length;

  // Service type breakdown
  const byService: Record<string, number> = {};
  for (const r of requests) {
    byService[r.service] = (byService[r.service] ?? 0) + 1;
  }
  const topServices = Object.entries(byService)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recent = requests.slice(0, 6);

  return (
    <div>
      <StaffPageHeader
        title="Overview"
        description="A summary of recent activity across all submissions."
        action={
          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <button
                type="button"
                onClick={load}
                className="flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/25 transition-colors"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {newCount}
                </span>
                new — click to load
              </button>
            )}
            <button
              type="button"
              onClick={load}
              disabled={isLoading}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        }
      />

      <div className="px-8 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total submissions" value={isLoading ? '—' : totalCount} />
          <StatCard label="This week" value={isLoading ? '—' : weekCount} sub="last 7 days" />
          <StatCard label="Today" value={isLoading ? '—' : todayCount} />
        </div>

        {isError && (
          <p className="text-sm text-destructive">
            Couldn&rsquo;t load submissions. Check your connection and refresh.
          </p>
        )}

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Recent submissions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                Recent submissions
              </h2>
              <Link
                href="/staff/submissions"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-card/60 animate-pulse" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            ) : (
              <div className="space-y-2">
                {recent.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start gap-4 rounded-xl border border-white/8 bg-card/40 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {r.firstName} {r.lastName}
                        </span>
                        <ServiceBadge service={r.service} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Breakdown by type */}
          <section>
            <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-4">
              By type
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-card/60 animate-pulse" />
                ))}
              </div>
            ) : topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {topServices.map(([service, count]) => (
                  <div
                    key={service}
                    className="flex items-center justify-between rounded-lg border border-white/8 bg-card/40 px-4 py-3"
                  >
                    <ServiceBadge service={service} />
                    <span className="text-sm font-semibold tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <Link
            href="/staff/submissions"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-card/40 px-5 py-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium">Submissions</p>
                <p className="text-xs text-muted-foreground">Filter, search, and view details</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>

          <Link
            href="/staff/analytics"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-card/40 px-5 py-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BarChart2 size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">Page views and traffic trends</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function DashboardContent() {
  return (
    <StaffAuthGate>
      <OverviewContent />
    </StaffAuthGate>
  );
}
