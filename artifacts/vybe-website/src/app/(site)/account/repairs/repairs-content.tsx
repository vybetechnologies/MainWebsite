'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { Wrench, Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import { resolveApiBaseUrl } from '@/lib/api-base';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Repair {
  id: string;
  service: string;
  message: string;
  deviceType: string | null;
  brandModel: string | null;
  preferredDate: string | null;
  preferredServiceType: string | null;
  createdAt: string;
}

// ── Status badge ──────────────────────────────────────────────────────────────

function RepairBadge({ service }: { service: string }) {
  const s = service.toLowerCase();
  const color = s.includes('rescue') || s.includes('repair')
    ? 'bg-blue-500/15 text-blue-400'
    : s.includes('contact')
    ? 'bg-purple-500/15 text-purple-400'
    : 'bg-green-500/15 text-green-400';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {service}
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
        <Wrench size={20} className="text-primary" />
      </div>
      <div>
        <p className="font-medium">No repairs on file</p>
        <p className="text-sm text-muted-foreground mt-1">
          Submit a Tech Rescue request and it will appear here.
        </p>
      </div>
      <Link
        href="/tech-rescue"
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Plus size={14} />
        Book a repair
      </Link>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function RepairsContent() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    (async () => {
      try {
        const token = await getToken();
        const base = resolveApiBaseUrl(window.location.hostname) ?? '';
        const res = await fetch(`${base}/api/account/repairs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setRepairs(data.repairs ?? []);
      } catch {
        setError('Could not load repairs.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">My Repairs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All Tech Rescue requests submitted with your email address.
          </p>
        </div>
        <Link
          href="/tech-rescue"
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Plus size={14} />
          New request
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : repairs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {repairs.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-white/10 bg-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <RepairBadge service={r.service} />
                  {(r.deviceType || r.brandModel) && (
                    <p className="font-medium text-sm">
                      {[r.brandModel, r.deviceType].filter(Boolean).join(' — ')}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.message}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock size={11} />
                    {formatDate(r.createdAt)}
                  </p>
                  {r.preferredDate && (
                    <p className="text-xs text-muted-foreground">
                      Preferred: {r.preferredDate}
                    </p>
                  )}
                </div>
              </div>
              {r.preferredServiceType && (
                <p className="text-xs text-muted-foreground">
                  Service type: {r.preferredServiceType}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
