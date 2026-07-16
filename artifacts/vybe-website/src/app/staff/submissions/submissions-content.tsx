'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Wrench,
  Monitor,
  Image as ImageIcon,
} from 'lucide-react';
import { listBookingRequests } from '@workspace/api-client-react';
import type { BookingRequestRecord } from '@workspace/api-client-react';
import { StaffAuthGate, StaffPageHeader, ServiceBadge } from '../staff-shell';

// ── Helpers ───────────────────────────────────────────────────────────────────

const SERVICE_FILTERS = ['All', 'Tech Rescue', 'Contact', 'Careers'] as const;
type Filter = (typeof SERVICE_FILTERS)[number];

function matchesFilter(r: BookingRequestRecord, filter: Filter): boolean {
  if (filter === 'All') return true;
  const s = r.service.toLowerCase();
  if (filter === 'Tech Rescue') return s.includes('tech') || s.includes('repair') || s.includes('rescue');
  if (filter === 'Contact') return s.includes('contact') || s.includes('inquiry') || s.includes('general');
  if (filter === 'Careers') return s.includes('career') || s.includes('job') || s.includes('employment');
  return true;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ── Detail row ────────────────────────────────────────────────────────────────

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <Icon size={14} className="text-muted-foreground shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

function ExpandedDetail({ r }: { r: BookingRequestRecord }) {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-5 bg-card/60 border-b border-white/5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <DetailRow icon={Mail} label="Email" value={r.email} />
          {r.phone && <DetailRow icon={Phone} label="Phone" value={r.phone} />}
          {r.deviceType && <DetailRow icon={Monitor} label="Device type" value={r.deviceType} />}
          {r.brandModel && <DetailRow icon={Monitor} label="Brand / Model" value={r.brandModel} />}
          {r.preferredServiceType && (
            <DetailRow icon={Wrench} label="Preferred service" value={r.preferredServiceType} />
          )}
          {r.preferredDate && (
            <DetailRow icon={Calendar} label="Preferred date" value={r.preferredDate} />
          )}
          {r.photoObjectPath && (
            <DetailRow icon={ImageIcon} label="Photo attached" value={r.photoObjectPath} />
          )}
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground mb-1">Message</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.message}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Main table ────────────────────────────────────────────────────────────────

function SubmissionsTable() {
  const [requests, setRequests] = useState<BookingRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filter, setFilter] = useState<Filter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    setIsError(false);
    listBookingRequests()
      .then((r) => { setRequests(r.requests); setIsLoading(false); })
      .catch(() => { setIsError(true); setIsLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => requests.filter((r) => matchesFilter(r, filter)),
    [requests, filter],
  );

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div>
      <StaffPageHeader
        title="Submissions"
        description={`${filtered.length} of ${requests.length} submissions`}
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

      <div className="px-8 py-6 space-y-5">
        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {SERVICE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setExpandedId(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isError && (
          <p className="text-sm text-destructive">
            Couldn&rsquo;t load submissions. Check your connection and refresh.
          </p>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-card/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No submissions match this filter.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-card/80 text-left text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-medium w-8" />
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((r) => {
                  const expanded = expandedId === r.id;
                  return (
                    <>
                      <tr
                        key={r.id}
                        onClick={() => toggleExpand(r.id)}
                        className="cursor-pointer hover:bg-card/40 transition-colors align-top"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                          {formatDateTime(r.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {r.firstName} {r.lastName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <a
                            href={`mailto:${r.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:underline text-xs"
                          >
                            {r.email}
                          </a>
                          {r.phone && (
                            <div className="text-muted-foreground text-xs">{r.phone}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ServiceBadge service={r.service} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">
                          {r.message}
                        </td>
                      </tr>
                      {expanded && <ExpandedDetail key={`${r.id}-detail`} r={r} />}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function SubmissionsContent() {
  return (
    <StaffAuthGate>
      <SubmissionsTable />
    </StaffAuthGate>
  );
}
