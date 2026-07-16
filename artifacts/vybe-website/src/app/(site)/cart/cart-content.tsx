'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package, CreditCard, X } from 'lucide-react';
import Link from 'next/link';
import { SquarePaymentForm, PaymentReceipt, type OrderLineItem } from '@/components/square-payment-form';
import { resolveApiBaseUrl } from '@/lib/api-base';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <ShoppingCart size={28} className="text-primary" />
      </div>
      <div>
        <h2 className="font-display text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          Add VYBE products or services to get started.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/shop"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          Browse the shop <ArrowRight size={14} />
        </Link>
        <Link
          href="/tech-rescue"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Book a repair
        </Link>
      </div>
    </div>
  );
}

// ── Cart item row ─────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: ReturnType<typeof useCart>['items'][number];
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}) {
  const typeColors: Record<string, string> = {
    product: 'bg-blue-500/15 text-blue-400',
    service: 'bg-purple-500/15 text-purple-400',
    repair: 'bg-amber-500/15 text-amber-400',
  };

  return (
    <div className="flex items-start gap-4 py-5 border-b border-white/8 last:border-0">
      <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center shrink-0 border border-white/10">
        <Package size={20} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-medium text-sm">{item.name}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${typeColors[item.type] ?? 'bg-white/10 text-muted-foreground'}`}>
          {item.type}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onQtyChange(item.id, item.qty - 1)}
          disabled={item.qty <= 1}
          className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
        <button
          type="button"
          onClick={() => onQtyChange(item.id, item.qty + 1)}
          className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
      {item.price != null && (
        <p className="text-sm font-semibold tabular-nums shrink-0">
          {formatPrice(item.price * item.qty)}
        </p>
      )}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
        title="Remove"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// ── Checkout modal ────────────────────────────────────────────────────────────

function CheckoutModal({
  totalCents,
  buyerEmail,
  cartItems,
  onSuccess,
  onClose,
}: {
  totalCents: number;
  buyerEmail?: string;
  cartItems: ReturnType<typeof useCart>['items'];
  onSuccess: (receiptUrl: string | null) => void;
  onClose: () => void;
}) {
  // Build Square order line items for items that came from the marketplace
  const orderLineItems: OrderLineItem[] = cartItems
    .filter((i) => i.squareCatalogVariationId && i.price != null)
    .map((i) => ({
      catalogVariationId: i.squareCatalogVariationId!,
      name: i.name,
      quantity: i.qty,
      basePriceCents: i.price!,
    }));

  // Use order endpoint only when ALL priced items are from Square catalog
  const pricedItems = cartItems.filter((i) => i.price != null);
  const allFromCatalog =
    pricedItems.length > 0 &&
    pricedItems.every((i) => i.squareCatalogVariationId != null);

  const note = cartItems.map((i) => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ''}`).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
        <SquarePaymentForm
          amountCents={totalCents}
          label={`Pay ${formatPrice(totalCents)}`}
          note={allFromCatalog ? undefined : `VYBE order: ${note}`}
          buyerEmail={buyerEmail}
          lineItems={allFromCatalog ? orderLineItems : undefined}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CartContent() {
  const { items, removeFromCart, updateQty, clearCart } = useCart();

  // Read Clerk user safely (SSR-safe; cart page is client-only)
  let buyerEmail: string | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useUser } = require('@clerk/react') as typeof import('@clerk/react');
    // This is a hook call — only valid at top level. Wrapped in try so it
    // doesn't throw during static export prerender.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useUser();
    buyerEmail = user?.primaryEmailAddress?.emailAddress;
  } catch {
    buyerEmail = undefined;
  }

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null | undefined>(undefined);

  const totalCents = items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0);
  const hasPrices = items.some((i) => i.price != null);

  if (items.length === 0) return <EmptyState />;

  // Payment completed — show receipt
  if (receiptUrl !== undefined) {
    return (
      <div className="container mx-auto max-w-3xl px-6 py-16">
        <PaymentReceipt
          receiptUrl={receiptUrl}
          onDone={() => { clearCart(); setReceiptUrl(undefined); }}
        />
      </div>
    );
  }

  return (
    <>
      {checkoutOpen && hasPrices && totalCents > 0 && (
        <CheckoutModal
          totalCents={totalCents}
          buyerEmail={buyerEmail}
          cartItems={items}
          onSuccess={(url) => { setReceiptUrl(url); setCheckoutOpen(false); clearCart(); }}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      <div className="container mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Your Cart</h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card px-6">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onRemove={removeFromCart}
              onQtyChange={updateQty}
            />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-card p-6 space-y-4">
          {hasPrices && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-lg tabular-nums">{formatPrice(totalCents)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 space-y-3">
            {hasPrices && totalCents > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <CreditCard size={15} />
                  Pay {formatPrice(totalCents)} with Square
                </button>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/15 text-sm font-medium hover:bg-white/5 transition-colors text-muted-foreground"
                >
                  Request a quote instead
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Request a quote <ArrowRight size={15} />
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  Our team will follow up within one business day.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
