'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Package, Loader2, AlertCircle, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { resolveApiBaseUrl } from '@/lib/api-base';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CatalogVariation {
  id: string;
  name: string;
  priceCents: number;
  sku: string | null;
}

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  variations: CatalogVariation[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  if (cents === 0) return 'Price on request';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

// ── Item card ─────────────────────────────────────────────────────────────────

function CatalogCard({ item }: { item: CatalogItem }) {
  const { addToCart } = useCart();
  const [selectedVariationId, setSelectedVariationId] = useState(item.variations[0]?.id ?? '');
  const [added, setAdded] = useState(false);

  const selectedVar = item.variations.find((v) => v.id === selectedVariationId) ?? item.variations[0];

  function handleAddToCart() {
    if (!selectedVar) return;
    addToCart({
      id: `${item.id}-${selectedVar.id}`,
      name: item.variations.length > 1
        ? `${item.name} — ${selectedVar.name}`
        : item.name,
      description: item.description || undefined,
      price: selectedVar.priceCents > 0 ? selectedVar.priceCents : undefined,
      type: 'product',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const displayPrice = selectedVar ? formatPrice(selectedVar.priceCents) : 'Price on request';

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-card overflow-hidden group hover:border-primary/30 transition-colors">
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
        <Package size={36} className="text-primary/40" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1 space-y-1.5">
          <h3 className="font-semibold text-sm leading-snug">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
          )}
        </div>

        {/* Variation selector */}
        {item.variations.length > 1 && (
          <select
            value={selectedVariationId}
            onChange={(e) => setSelectedVariationId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-background text-sm px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {item.variations.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
                {v.priceCents > 0 ? ` — ${formatPrice(v.priceCents)}` : ''}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-primary" />
            <span className="text-sm font-semibold">{displayPrice}</span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              added
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            {added ? (
              '✓ Added'
            ) : (
              <><Plus size={12} /> Add to cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CatalogContent() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = resolveApiBaseUrl(window.location.hostname) ?? '';
    fetch(`${base}/api/catalog/items`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load catalog');
        return res.json();
      })
      .then((data) => setItems(data.items ?? []))
      .catch(() => setError('Could not load the product catalog right now.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 space-y-3">
        <p className="text-primary text-sm font-semibold uppercase tracking-widest">Shop</p>
        <h1 className="font-display text-4xl font-bold">VYBE Catalog</h1>
        <p className="text-muted-foreground max-w-xl">
          Products and services from the VYBE Technologies store. Add items to your cart and check
          out securely with Square — or request a custom quote.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading catalog…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <AlertCircle size={28} className="text-destructive" />
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <Package size={40} className="text-muted-foreground/40" />
          <div>
            <p className="font-medium">No products in the catalog yet</p>
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
              and they'll appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ShoppingCart size={15} />
              View cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
