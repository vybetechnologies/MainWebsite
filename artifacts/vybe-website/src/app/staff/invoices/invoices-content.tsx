'use client';

import { useEffect, useState } from 'react';
import {
  FileText, Plus, Trash2, Loader2, ExternalLink,
  CheckCircle2, AlertCircle, Send,
} from 'lucide-react';
import { StaffAuthGate, StaffPageHeader } from '../staff-shell';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { useAuth } from '@clerk/react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  name: string;
  amountCents: number;
  qty: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  publicUrl: string | null;
  dueDate: string | null;
  recipientEmail: string | null;
  totalCents: number;
  createdAt: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-white/10 text-muted-foreground',
  UNPAID: 'bg-amber-500/15 text-amber-400',
  SCHEDULED: 'bg-blue-500/15 text-blue-400',
  PARTIALLY_PAID: 'bg-cyan-500/15 text-cyan-400',
  PAID: 'bg-emerald-500/15 text-emerald-400',
  REFUNDED: 'bg-red-500/15 text-red-400',
  CANCELED: 'bg-white/10 text-muted-foreground',
};

// ── Invoice list ──────────────────────────────────────────────────────────────

function InvoiceList({ invoices, loading, error }: { invoices: Invoice[]; loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 text-muted-foreground text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading invoices…
      </div>
    );
  }
  if (error) {
    return <p className="text-sm text-destructive py-6">{error}</p>;
  }
  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 py-12 text-center text-muted-foreground text-sm">
        No invoices yet — create one using the form below.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-card/60 text-muted-foreground">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Number</th>
            <th className="text-left px-4 py-3 font-medium">Recipient</th>
            <th className="text-left px-4 py-3 font-medium">Due</th>
            <th className="text-right px-4 py-3 font-medium">Amount</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => (
            <tr key={inv.id} className={`border-t border-white/8 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-card/30'}`}>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{inv.invoiceNumber}</td>
              <td className="px-4 py-3">{inv.recipientEmail ?? '—'}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.dueDate)}</td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">
                {inv.totalCents > 0 ? formatPrice(inv.totalCents) : '—'}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status] ?? 'bg-white/10 text-muted-foreground'}`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {inv.publicUrl && (
                  <a
                    href={inv.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    View
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Create invoice form ───────────────────────────────────────────────────────

function CreateInvoiceForm({ onCreated, apiBase, token }: { onCreated: () => void; apiBase: string; token: string | null }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ name: '', amountCents: 0, qty: 1 }]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ invoiceNumber: string; publicUrl: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addLine() {
    setLineItems((prev) => [...prev, { name: '', amountCents: 0, qty: 1 }]);
  }
  function removeLine(i: number) {
    setLineItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateLine(i: number, field: keyof LineItem, value: string | number) {
    setLineItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  const totalCents = lineItems.reduce((sum, l) => sum + l.amountCents * l.qty, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!customerName.trim() || !customerEmail.trim() || !dueDate) {
      setError('Fill in customer name, email, and due date.');
      return;
    }
    if (lineItems.some((l) => !l.name.trim() || l.amountCents <= 0)) {
      setError('Each line item needs a name and a positive amount.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/staff/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ customerName, customerEmail, dueDate, note, lineItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create invoice');
      setResult({ invoiceNumber: data.invoiceNumber, publicUrl: data.publicUrl });
      onCreated();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 flex flex-col items-center gap-4 text-center">
        <CheckCircle2 size={32} className="text-emerald-400" />
        <div>
          <p className="font-semibold">Invoice {result.invoiceNumber} sent!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Square emailed the invoice to {customerEmail}.
          </p>
        </div>
        {result.publicUrl && (
          <a href={result.publicUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1">
            <ExternalLink size={13} /> View invoice
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setCustomerName(''); setCustomerEmail(''); setDueDate(''); setNote('');
            setLineItems([{ name: '', amountCents: 0, qty: 1 }]);
          }}
          className="mt-2 px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5 transition-colors"
        >
          Create another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-card p-6 space-y-5">
      <h3 className="font-semibold flex items-center gap-2">
        <Send size={15} className="text-primary" />
        New invoice
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Customer name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Customer email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thanks for your business!"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Line items</label>
        {lineItems.map((line, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={line.name}
              onChange={(e) => updateLine(i, 'name', e.target.value)}
              placeholder="Description"
              className="flex-1 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={line.amountCents / 100 || ''}
              onChange={(e) => updateLine(i, 'amountCents', Math.round(parseFloat(e.target.value || '0') * 100))}
              placeholder="$0.00"
              className="w-24 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              min="1"
              value={line.qty}
              onChange={(e) => updateLine(i, 'qty', parseInt(e.target.value || '1'))}
              className="w-16 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center"
            />
            {lineItems.length > 1 && (
              <button type="button" onClick={() => removeLine(i)}
                className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button type="button" onClick={addLine}
            className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Plus size={12} /> Add line item
          </button>
          {totalCents > 0 && (
            <span className="text-sm font-semibold">Total: {formatPrice(totalCents)}</span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
      >
        {submitting ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send invoice via Square</>}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoicesContent() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const apiBase = typeof window !== 'undefined'
    ? (resolveApiBaseUrl(window.location.hostname) ?? '')
    : '';

  async function loadInvoices(tk: string | null) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/staff/invoices`, {
        headers: tk ? { Authorization: `Bearer ${tk}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load invoices');
      const data = await res.json();
      setInvoices(data.invoices ?? []);
    } catch {
      setError('Could not load invoices.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
      loadInvoices(tk);
    });
  }, []);

  return (
    <StaffAuthGate>
      <StaffPageHeader
        title="Invoices"
        description="Create and send Square invoices to customers. They'll receive a payment link by email."
      />
      <div className="p-6 lg:p-10 max-w-4xl space-y-8">
        <CreateInvoiceForm
          onCreated={() => loadInvoices(token)}
          apiBase={apiBase}
          token={token}
        />
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-sm">
            <FileText size={14} className="text-primary" /> Recent invoices
          </h3>
          <InvoiceList invoices={invoices} loading={loading} error={error} />
        </div>
      </div>
    </StaffAuthGate>
  );
}
