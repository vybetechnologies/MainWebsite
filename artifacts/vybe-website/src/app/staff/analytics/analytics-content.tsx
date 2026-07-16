'use client';

import { useEffect, useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { getStaffAnalytics } from '@workspace/api-client-react';
import type { StaffAnalyticsResponse } from '@workspace/api-client-react';
import { StaffAuthGate, StaffPageHeader } from '../staff-shell';

// ── Helpers ───────────────────────────────────────────────────────────────────

const RANGES = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
] as const;

type Range = (typeof RANGES)[number]['value'];

function buildDailyChart(
  dailyRows: StaffAnalyticsResponse['dailyRows'],
  days: number,
): { date: string; views: number }[] {
  // Aggregate across all pages per day
  const totals: Record<string, number> = {};
  for (const row of dailyRows) {
    totals[row.viewDate] = (totals[row.viewDate] ?? 0) + row.count;
  }

  // Fill every day in range even if missing
  const result: { date: string; views: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: totals[key] ?? 0,
    });
  }
  return result;
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{payload[0].value} views</p>
    </div>
  );
}

// ── Analytics view ────────────────────────────────────────────────────────────

function AnalyticsView() {
  const [data, setData] = useState<StaffAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [range, setRange] = useState<Range>(30);

  const load = (days: Range) => {
    setIsLoading(true);
    setIsError(false);
    getStaffAnalytics(days)
      .then((r) => { setData(r); setIsLoading(false); })
      .catch(() => { setIsError(true); setIsLoading(false); });
  };

  useEffect(() => { load(range); }, [range]);

  const chartData = useMemo(
    () => (data ? buildDailyChart(data.dailyRows, range) : []),
    [data, range],
  );

  const totalViews = data?.totalsByPath.reduce((s, r) => s + r.totalViews, 0) ?? 0;

  return (
    <div>
      <StaffPageHeader
        title="Analytics"
        description="Page view traffic across the VYBE website."
        action={
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {RANGES.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRange(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    range === value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card/60 text-muted-foreground hover:bg-card border border-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => load(range)}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      />

      <div className="px-8 py-8 space-y-8">
        {isError && (
          <p className="text-sm text-destructive">
            Couldn&rsquo;t load analytics. Check your connection and refresh.
          </p>
        )}

        {/* Summary card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-card px-5 py-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Total views
            </p>
            <p className="font-display text-3xl font-bold tabular-nums mt-1">
              {isLoading ? '—' : totalViews.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">last {range} days</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-card px-5 py-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Pages tracked
            </p>
            <p className="font-display text-3xl font-bold tabular-nums mt-1">
              {isLoading ? '—' : (data?.totalsByPath.length ?? 0)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-card px-5 py-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Avg. per day
            </p>
            <p className="font-display text-3xl font-bold tabular-nums mt-1">
              {isLoading ? '—' : range > 0 ? Math.round(totalViews / range) : 0}
            </p>
          </div>
        </div>

        {/* Daily chart */}
        <section>
          <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-4">
            Daily views
          </h2>
          <div className="rounded-xl border border-white/10 bg-card/40 p-4">
            {isLoading ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                Loading…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={range <= 7 ? 24 : range <= 30 ? 10 : 4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: 'hsl(220 15% 65%)' }}
                    tickLine={false}
                    axisLine={false}
                    interval={range <= 7 ? 0 : range <= 30 ? 4 : 14}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'hsl(220 15% 65%)' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="views" fill="hsl(262 83% 62%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Top pages table */}
        <section>
          <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-4">
            Top pages
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-card/40 animate-pulse" />
              ))}
            </div>
          ) : !data || data.totalsByPath.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data for this period.</p>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card/80 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Page
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                      Views
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground w-40">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.totalsByPath.map((row) => {
                    const pct = totalViews > 0 ? Math.round((row.totalViews / totalViews) * 100) : 0;
                    return (
                      <tr key={row.path} className="hover:bg-card/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-foreground/80">
                          {row.path}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold">
                          {row.totalViews.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function AnalyticsContent() {
  return (
    <StaffAuthGate>
      <AnalyticsView />
    </StaffAuthGate>
  );
}
