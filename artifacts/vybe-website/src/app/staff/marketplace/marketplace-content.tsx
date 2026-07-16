'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Package,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { StaffPageHeader } from '@/app/staff/staff-shell';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CatalogVariation {
  id: string;
  name: string;
  priceCents: number;
  sku: string | null;
}

interface StaffCatalogItem {
  id: string;
  name: string;
  description: string;
  categoryName: string | null;
  imageIds: string[];
  variations: CatalogVariation[];
  visible: boolean;
  displayOrder: number;
  isDeleted: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  if (cents === 0) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function priceLabel(variations: CatalogVariation[]) {
  const priced = variations.filter((v) => v.priceCents > 0).map((v) => v.priceCents);
  if (priced.length === 0) return 'Quote';
  const min = Math.min(...priced);
  const max = Math.max(...priced);
  return min === max ? formatPrice(min) : `${formatPrice(min)}+`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MarketplaceContent() {
  const [items, setItems] = useState<StaffCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track in-flight patch calls per item id
  const [patching, setPatching] = useState<Set<string>>(new Set());
  const [patchError, setPatchError] = useState<string | null>(null);

  const apiBase = typeof window !== 'undefined'
    ? (resolveApiBaseUrl(window.location.hostname) ?? '')
    : '';

  const fetchItems = useCallback(
    async (showSyncing = false) => {
      if (showSyncing) setSyncing(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/api/staff/catalog`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setItems(data.items ?? []);
      } catch {
        setError('Could not load the Square catalog.');
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    [apiBase],
  );

  useEffect(() => { fetchItems(); }, [fetchItems]);

  /**
   * PATCH a single item — returns true on success, false on failure.
   * Callers are responsible for reverting optimistic state on false.
   */
  const patch = useCallback(
    async (id: string, payload: { visible?: boolean; displayOrder?: number }): Promise<boolean> => {
      setPatching((prev) => new Set(prev).add(id));
      try {
        const res = await fetch(`${apiBase}/api/staff/catalog/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setPatchError(data.error ?? 'Failed to save change — please try again.');
          return false;
        }
        setPatchError(null);
        return true;
      } catch {
        setPatchError('Network error — please try again.');
        return false;
      } finally {
        setPatching((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [apiBase],
  );

  // Optimistic visibility toggle — reverts on PATCH failure
  const toggleVisible = async (id: string, current: boolean) => {
    const newVisible = !current;
    // Apply optimistically
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, visible: newVisible } : i)));
    const ok = await patch(id, { visible: newVisible });
    if (!ok) {
      // Revert
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, visible: current } : i)));
    }
  };

  // Move an item up or down — reverts both rows on PATCH failure
  const moveItem = async (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const snapshot = [...items];

    // Apply optimistically
    const next = [...items];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    const updated = next.map((item, i) => ({ ...item, displayOrder: i }));
    setItems(updated);

    // Persist both affected items
    const [ok1, ok2] = await Promise.all([
      patch(updated[idx].id, { displayOrder: updated[idx].displayOrder }),
      patch(updated[targetIdx].id, { displayOrder: updated[targetIdx].displayOrder }),
    ]);

    if (!ok1 || !ok2) {
      // Revert to pre-move state
      setItems(snapshot);
    }
  };

  const visibleCount = items.filter((i) => i.visible && !i.isDeleted).length;

  return (
    <div className="flex flex-col h-full">
      <StaffPageHeader
        title="Marketplace"
        description="Control which Square catalog items appear in the public shop."
        action={
          <button
            type="button"
            onClick={() => fetchItems(true)}
            disabled={syncing}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync from Square'}
          </button>
        }
      />

      {/* Patch error banner */}
      {patchError && (
        <div className="mx-8 mt-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2.5 flex items-center justify-between gap-4 text-sm text-destructive">
          <span>{patchError}</span>
          <button
            type="button"
            onClick={() => setPatchError(null)}
            className="shrink-0 text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats bar */}
      {!loading && !error && (
        <div className="px-8 py-4 flex items-center gap-6 border-b border-white/10 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{visibleCount}</span> of{' '}
            {items.filter((i) => !i.isDeleted).length} items visible in shop
          </span>
          {visibleCount === 0 && (
            <span className="text-amber-400 text-xs">
              Toggle at least one item on to show products in the public shop.
            </span>
          )}
        </div>
      )}

      <div className="flex-1 overflow-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" />
            Loading catalog from Square…
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <AlertCircle size={28} className="text-destructive" />
            <p className="text-muted-foreground text-sm">{error}</p>
            <button
              type="button"
              onClick={() => fetchItems()}
              className="text-xs text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <Package size={44} className="text-muted-foreground/30" />
            <div>
              <p className="font-medium">No items in Square catalog</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add products in your{' '}
                <a
                  href="https://squareup.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Square Dashboard
                </a>{' '}
                then click Sync.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-card/60 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3 w-8">#</th>
                  <th className="text-left px-4 py-3">Item</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Price</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Variations</th>
                  <th className="text-center px-4 py-3">Visible</th>
                  <th className="text-center px-4 py-3">Order</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const isPending = patching.has(item.id);
                  const isGhosted = item.isDeleted;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-white/5 last:border-0 transition-colors ${
                        isGhosted
                          ? 'opacity-40'
                          : item.visible
                          ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                          : 'hover:bg-white/3'
                      }`}
                    >
                      {/* Position */}
                      <td className="px-4 py-3 text-muted-foreground tabular-nums text-xs">
                        {idx + 1}
                      </td>

                      {/* Name + description */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center shrink-0">
                            <Package size={14} className="text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">
                              {item.name}
                              {isGhosted && (
                                <span className="ml-2 text-[10px] text-destructive">Deleted in Square</span>
                              )}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        {item.categoryName ? (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                            {item.categoryName}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 hidden sm:table-cell text-xs tabular-nums">
                        {priceLabel(item.variations)}
                      </td>

                      {/* Variations */}
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground tabular-nums">
                        {item.variations.length}
                      </td>

                      {/* Visible toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          title={item.visible ? 'Hide from shop' : 'Show in shop'}
                          disabled={isPending || isGhosted}
                          onClick={() => toggleVisible(item.id, item.visible)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors disabled:opacity-40 ${
                            item.visible
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                          }`}
                        >
                          {isPending ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : item.visible ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                      </td>

                      {/* Order controls */}
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0 || isPending}
                            onClick={() => moveItem(idx, 'up')}
                            className="w-6 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors disabled:opacity-20"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === items.length - 1 || isPending}
                            onClick={() => moveItem(idx, 'down')}
                            className="w-6 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors disabled:opacity-20"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
