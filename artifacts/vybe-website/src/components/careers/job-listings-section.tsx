'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, Building2, ArrowRight } from 'lucide-react';
import { getJobListings } from '@workspace/api-client-react';
import type { JobListing } from '@workspace/api-client-react';
import { ApplicationModal } from './application-modal';

// ── Job card ──────────────────────────────────────────────────────────────────

function JobCard({
  listing,
  onApply,
}: {
  listing: JobListing;
  onApply: (l: JobListing) => void;
}) {
  return (
    <div className="group rounded-2xl border border-card-border bg-card p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">{listing.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 size={13} />
              {listing.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {listing.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {listing.type}
            </span>
          </div>
        </div>
        {listing.salaryRange && (
          <span className="shrink-0 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
            {listing.salaryRange}
          </span>
        )}
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
        {listing.description}
      </p>

      {listing.requirements && (
        <ul className="space-y-1">
          {listing.requirements
            .split('\n')
            .filter(Boolean)
            .slice(0, 4)
            .map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1.5 shrink-0">—</span>
                {req.replace(/^[-•*]\s*/, '')}
              </li>
            ))}
        </ul>
      )}

      <div className="pt-2 mt-auto">
        <button
          type="button"
          onClick={() => onApply(listing)}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all"
        >
          Apply now
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function JobListingsSection() {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyTarget, setApplyTarget] = useState<JobListing | null>(null);

  useEffect(() => {
    getJobListings()
      .then((r) => { setListings(r.listings); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
        {[1, 2].map((i) => (
          <div key={i} className="h-52 rounded-2xl bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-card-border bg-card p-10 text-center max-w-2xl">
        <p className="text-lg text-muted-foreground">
          There are no open roles right now, but we are always interested in meeting talented
          people.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
        {listings.map((listing) => (
          <JobCard key={listing.id} listing={listing} onApply={setApplyTarget} />
        ))}
      </div>

      {applyTarget && (
        <ApplicationModal
          listing={applyTarget}
          onClose={() => setApplyTarget(null)}
        />
      )}
    </>
  );
}
