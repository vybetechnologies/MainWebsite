'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const TOKEN_STORAGE_KEY = 'vybe-admin-analytics-token';
const DAY_RANGE_OPTIONS = [7, 30, 90] as const;

type PageViewsReportResponse = {
  sinceDate: string;
  days: number;
  totalsByPath: { path: string; totalViews: number }[];
  dailyRows: { path: string; viewDate: string; count: number }[];
};

/**
 * A tiny palette rotated across whichever paths appear in the trend chart.
 * Kept short and simple since this is an internal tool, not a branded page.
 */
const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];

function buildTrendSeries(dailyRows: PageViewsReportResponse['dailyRows'], topPaths: string[]) {
  const byDate = new Map<string, Record<string, number | string>>();

  for (const row of dailyRows) {
    if (!topPaths.includes(row.path)) continue;
    const entry = byDate.get(row.viewDate) ?? { date: row.viewDate };
    entry[row.path] = (Number(entry[row.path]) || 0) + row.count;
    byDate.set(row.viewDate, entry);
  }

  return Array.from(byDate.values()).sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );
}

export function PageViewReport() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<PageViewsReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/analytics/pageviews?days=${days}`, {
      headers: { 'x-admin-token': token },
    })
      .then(async (res) => {
        if (res.status === 401) {
          window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          if (!cancelled) {
            setToken(null);
            setError('That token was rejected. Please re-enter it.');
          }
          return;
        }
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const json = (await res.json()) as PageViewsReportResponse;
        if (!cancelled) setData(json);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load report');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, days]);

  const topPaths = useMemo(
    () => (data?.totalsByPath ?? []).slice(0, CHART_COLORS.length).map((row) => row.path),
    [data],
  );
  const trendSeries = useMemo(
    () => (data ? buildTrendSeries(data.dailyRows, topPaths) : []),
    [data, topPaths],
  );
  const grandTotal = useMemo(
    () => (data?.totalsByPath ?? []).reduce((sum, row) => sum + row.totalViews, 0),
    [data],
  );

  function handleSubmitToken(event: React.FormEvent) {
    event.preventDefault();
    if (!tokenInput.trim()) return;
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
    setError(null);
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4">
        <Card>
          <CardHeader>
            <CardTitle>Internal Analytics</CardTitle>
            <CardDescription>Enter the admin token to view the page-view report.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitToken} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-token">Admin token</Label>
                <Input
                  id="admin-token"
                  type="password"
                  autoComplete="off"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit">View report</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Page Views</h1>
          <p className="text-sm text-muted-foreground">
            Which pages visitors view most, aggregated by path — no per-visitor data is collected.
          </p>
        </div>
        <div className="flex gap-2">
          {DAY_RANGE_OPTIONS.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={days === option ? 'default' : 'outline'}
              onClick={() => setDays(option)}
            >
              Last {option}d
            </Button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {isLoading && !data && <p className="text-sm text-muted-foreground">Loading…</p>}

      {data && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total views</CardTitle>
              <CardDescription>
                {grandTotal.toLocaleString()} views across {data.totalsByPath.length} page
                {data.totalsByPath.length === 1 ? '' : 's'} since {data.sinceDate}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.totalsByPath.slice(0, 15)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="path" width={180} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="totalViews" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {trendSeries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trend for top pages</CardTitle>
                <CardDescription>Daily views for the most-viewed pages in this range.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      {topPaths.map((path, index) => (
                        <Line
                          key={path}
                          type="monotone"
                          dataKey={path}
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          dot={false}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>By page</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.totalsByPath.map((row) => (
                    <TableRow key={row.path}>
                      <TableCell className="font-mono text-sm">{row.path}</TableCell>
                      <TableCell className="text-right">{row.totalViews.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {data.totalsByPath.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No page views recorded in this range yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
