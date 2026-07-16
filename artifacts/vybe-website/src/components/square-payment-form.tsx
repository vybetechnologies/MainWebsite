'use client';

/**
 * SquarePaymentForm — reusable embedded card form powered by Square Web Payments SDK.
 *
 * Simple payment (deposit, ad-hoc):
 *   <SquarePaymentForm amountCents={5000} label="Pay $50 deposit" ... />
 *
 * Marketplace order checkout (creates a Square Order then charges it):
 *   <SquarePaymentForm
 *     amountCents={totalCents}
 *     lineItems={[{ catalogVariationId, name, quantity, basePriceCents }]}
 *     label="Pay $XX.XX"
 *     buyerEmail="customer@example.com"
 *     onSuccess={(receiptUrl) => ...}
 *     onCancel={() => ...}
 *   />
 */

import { useEffect, useRef, useState } from 'react';
import { CreditCard, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { initSquarePayments, type SquareCard } from '@/lib/square-payments';
import { resolveApiBaseUrl } from '@/lib/api-base';

export interface OrderLineItem {
  catalogVariationId: string;
  name: string;
  quantity: number;
  basePriceCents: number;
}

interface Props {
  amountCents: number;
  label: string;
  note?: string;
  buyerEmail?: string;
  /** When provided, creates a Square Order before charging (marketplace checkout). */
  lineItems?: OrderLineItem[];
  onSuccess: (receiptUrl: string | null) => void;
  onCancel: () => void;
}

function formatUSD(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    cents / 100,
  );
}

export function SquarePaymentForm({ amountCents, label, note, buyerEmail, lineItems, onSuccess, onCancel }: Props) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'paying' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apiBase = typeof window !== 'undefined'
    ? (resolveApiBaseUrl(window.location.hostname) ?? '')
    : '';

  useEffect(() => {
    let destroyed = false;

    (async () => {
      try {
        const payments = await initSquarePayments(apiBase);
        if (destroyed) return;

        const card = await payments.card({
          style: {
            '.input-container': { borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px' },
            '.input-container.is-focus': { borderColor: 'hsl(262 83% 62%)' },
            '.input-container.is-error': { borderColor: '#ef4444' },
            input: { color: '#f8f8f8', fontFamily: 'inherit' },
            'input::placeholder': { color: 'rgba(255,255,255,0.35)' },
            '.message-text': { color: '#f8f8f8' },
            '.message-icon': { color: '#f8f8f8' },
          },
        });

        if (destroyed) { await card.destroy(); return; }
        await card.attach('#square-card-container');
        if (destroyed) { await card.destroy(); return; }

        cardRef.current = card;
        setPhase('ready');
      } catch {
        if (!destroyed) {
          setErrorMsg('Could not load the payment form. Please refresh and try again.');
          setPhase('error');
        }
      }
    })();

    return () => {
      destroyed = true;
      cardRef.current?.destroy();
      cardRef.current = null;
    };
  }, [apiBase]);

  const handlePay = async () => {
    if (!cardRef.current) return;
    setPhase('paying');
    setErrorMsg(null);

    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK' || !result.token) {
        setErrorMsg(result.errors?.[0]?.message ?? 'Card tokenization failed.');
        setPhase('ready');
        return;
      }

      // Choose endpoint: order-and-pay for marketplace carts, simple payment for deposits
      const useOrderEndpoint = lineItems && lineItems.length > 0;
      const endpoint = useOrderEndpoint
        ? `${apiBase}/api/payments/create-order-and-pay`
        : `${apiBase}/api/payments/create-payment`;

      const body = useOrderEndpoint
        ? {
            sourceId: result.token,
            lineItems,
            ...(buyerEmail ? { buyerEmail } : {}),
          }
        : {
            sourceId: result.token,
            amountCents,
            ...(note ? { note } : {}),
            ...(buyerEmail ? { buyerEmailAddress: buyerEmail } : {}),
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Payment was declined.');
        setPhase('ready');
        return;
      }

      onSuccess(data.receiptUrl ?? null);
    } catch {
      setErrorMsg('Network error — please try again.');
      setPhase('ready');
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6 space-y-5 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          <span className="font-semibold text-sm">Secure payment</span>
        </div>
        <span className="font-bold text-lg">{formatUSD(amountCents)}</span>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Card details</label>
        <div ref={cardContainerRef} id="square-card-container" className="min-h-[90px]" />
        {phase === 'loading' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" />
            Loading secure form…
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{errorMsg}</p>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handlePay}
          disabled={phase !== 'ready'}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {phase === 'paying' ? (
            <><Loader2 size={15} className="animate-spin" /> Processing…</>
          ) : (
            <><Lock size={14} /> {label}</>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
        <Lock size={10} />
        Payments secured by Square. Card data never touches VYBE servers.
      </p>
    </div>
  );
}

// ── Receipt confirmation ───────────────────────────────────────────────────────

export function PaymentReceipt({ receiptUrl, onDone }: { receiptUrl: string | null; onDone: () => void }) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center flex flex-col items-center gap-4">
      <CheckCircle2 size={36} className="text-emerald-400" />
      <div>
        <p className="font-semibold text-lg">Payment successful!</p>
        <p className="text-sm text-muted-foreground mt-1">
          You'll receive a receipt from Square shortly.
        </p>
      </div>
      {receiptUrl && (
        <a
          href={receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View receipt →
        </a>
      )}
      <button
        type="button"
        onClick={onDone}
        className="mt-2 px-5 py-2 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
