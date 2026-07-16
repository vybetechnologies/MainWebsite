'use client';

import { useEffect, useState, useMemo } from 'react';
import { ShoppingCart, Plus, Package, Loader2, AlertCircle, Tag, Search, RefreshCw } from 'lucide-react';
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
  categoryName: string | null;
  variations: CatalogVariation[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  if (cents === 0) return 'Quote on request';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function priceRange(variations: CatalogVariation[]) {
  const priced = variations.filter((v) => v.priceCents > 0).map((v) => v.priceCents);
  if (priced.length === 0) return 'Quote on request';
  const min = Math.min(...priced);
  const max = Math.max(...priced);
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

// ── Cart badge ─────────────────────────────────────────────────────────────────

function CartBadge() {
  const { cartCount } = useCart();
  if (cartCount === 0) return null;
  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
    >
      <ShoppingCart size={16} />
      View cart ({cartCount})
    </Link>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────

function ShopCard({ item }: { item: CatalogItem }) {
  const { addToCart } = useCart();
  const [selectedVariationId, setSelectedVariationId] = useState(item.variations[0]?.id ?? '');
  const [added, setAdded] = useState(false);

  const selectedVar = item.variations.find((v) => v.id === selectedVariationId) ?? item.variations[0];

  function handleAddToCart() {
    if (!selectedVar) return;
    addToCart({
      id: `${item.id}-${selectedVar.id}`,
      name: item.variations.length > 1 ? `${item.name} — ${selectedVar.name}` : item.name,
      description: item.description || undefined,
      price: selectedVar.priceCents > 0 ? selectedVar.priceCents : undefined,
      type: 'product',
      squareCatalogVariationId: selectedVar.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-card overflow-hidden group hover:border-primary/30 transition-colors">
      {/* Placeholder image */}
      <div className="h-44 bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
        <Package size={40} className="text-primary/30" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        {item.categoryName && (
          <span className="inline-block self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary uppercase tracking-wide">
            {item.categoryName}
          </span>
        )}

        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-sm leading-snug">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
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
                {v.name}{v.priceCents > 0 ? ` — ${formatPrice(v.priceCents)}` : ''}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-primary" />
            <span className="text-sm font-semibold">
              {item.variations.length > 1
                ? (selectedVar ? formatPrice(selectedVar.priceCents) : priceRange(item.variations))
                : formatPrice(item.variations[0]?.priceCents ?? 0)}
            </span>
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
            {added ? '✓ Added' : <><Plus size={12} /> Add to cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ShopContent() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const fetchItems = () => {
    setLoading(true);
    setError(null);
    const base = resolveApiBaseUrl(window.location.hostname) ?? '';
    fetch(`${base}/api/catalog/items`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load catalog');
        return res.json();
      })
      .then((data) => setItems(data.items ?? []))
      .catch(() => setError('Could not load the shop right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.categoryName).filter(Boolean))] as string[];
    return ['All', ...cats.sort()];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = activeCategory === 'All' || item.categoryName === activeCategory;
      const matchQ = !query || item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [items, activeCategory, query]);

  return (
    <div className="container mx-auto max-w-7xl px-6 py-16 md:py-20">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <p className="text-primary text-sm font-semibold uppercase tracking-widest">Shop</p>
        <h1 className="font-display text-4xl font-bold">VYBE Marketplace</h1>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          Products and services from VYBE Technologies. Add items to your cart and check out
          securely with Square.
        </p>
      </div>

      {/* Toolbar */}
      {!loading && !error && items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={fetchItems}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      )}

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center py-36 gap-3 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading shop…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-36 text-center">
          <AlertCircle size={28} className="text-destructive" />
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchItems}
            className="text-xs text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-36 text-center">
          <Package size={44} className="text-muted-foreground/30" />
          <div>
            <p className="font-medium">No products available yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add products in your{' '}
              <a
                href="https://squareup.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Square Dashboard
              </a>
              , then enable them in the{' '}
              <Link href="/staff/marketplace" className="text-primary hover:underline">
                Staff Marketplace
              </Link>
              .
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted-foreground text-sm">No items match your search.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCategory('All'); }}
            className="text-xs text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <CartBadge />
    </div>
  );
}
