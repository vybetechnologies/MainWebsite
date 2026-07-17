'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2, AlertCircle, Plus, Pencil, Trash2, Eye, EyeOff, X, ExternalLink,
} from 'lucide-react';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { StaffPageHeader } from '@/app/staff/staff-shell';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Partner {
  id: number;
  name: string;
  logo: string;
  category: string;
  description: string;
  website: string;
  displayOrder: number;
  active: boolean;
}

const BLANK: Omit<Partner, 'id'> = {
  name: '',
  logo: '',
  category: '',
  description: '',
  website: '',
  displayOrder: 0,
  active: true,
};

const CATEGORY_SUGGESTIONS = [
  'Cloud & Software', 'Cloud & Workspace', 'Infrastructure', 'Cloud Marketplace',
  'Device Service', 'Repair & Parts', 'Payments', 'Communications',
  'Cybersecurity', 'Banking & Finance',
];

// ── Form panel ────────────────────────────────────────────────────────────────

function PartnerForm({
  initial,
  onSave,
  onCancel,
  saving,
  error,
}: {
  initial: Omit<Partner, 'id'>;
  onSave: (data: Omit<Partner, 'id'>) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form, v: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-display font-semibold text-base">
            {initial.name ? 'Edit Partner' : 'Add Partner'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <Field label="Company name" required>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Cloudflare"
              className={inputCls}
            />
          </Field>

          <Field label="Website" required>
            <input
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://example.com"
              className={inputCls}
            />
          </Field>

          <Field label="Category" required>
            <input
              list="category-list"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="e.g. Infrastructure"
              className={inputCls}
            />
            <datalist id="category-list">
              {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Field>

          <Field label="Logo path or URL" hint="e.g. /partners/cloudflare.png or https://…">
            <div className="flex items-center gap-3">
              <input
                value={form.logo}
                onChange={(e) => set('logo', e.target.value)}
                placeholder="/partners/name.svg"
                className={`${inputCls} flex-1`}
              />
              {form.logo && (
                <img
                  src={form.logo}
                  alt=""
                  className="h-8 w-16 object-contain rounded border border-white/10 bg-white p-1 shrink-0"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
          </Field>

          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              placeholder="Describe this partnership…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Display order">
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => set('displayOrder', Number(e.target.value))}
              className={`${inputCls} w-24`}
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set('active', !form.active)}
              className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
                form.active ? 'bg-emerald-500' : 'bg-white/20'
              }`}
              style={{ height: '22px' }}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4.5 h-4 rounded-full bg-white shadow transition-transform ${
                  form.active ? 'translate-x-4.5' : ''
                }`}
                style={{ width: '18px', height: '18px', transform: form.active ? 'translateX(18px)' : 'translateX(0)' }}
              />
            </div>
            <span className="text-sm font-medium">
              {form.active ? 'Visible on partners page' : 'Hidden from partners page'}
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !form.name.trim() || !form.website.trim() || !form.category.trim() || !form.description.trim()}
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {initial.name ? 'Save changes' : 'Add partner'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground/60">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary';

// ── Delete confirmation ───────────────────────────────────────────────────────

function DeleteConfirm({ name, onConfirm, onCancel, deleting }: {
  name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Remove partner?</h2>
        <p className="text-sm text-muted-foreground">
          This will permanently remove <span className="font-medium text-foreground">{name}</span> from the partners page.
        </p>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium disabled:opacity-50"
          >
            {deleting && <Loader2 size={13} className="animate-spin" />}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PartnersContent() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Partner | null>(null);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const apiBase = typeof window !== 'undefined'
    ? (resolveApiBaseUrl(window.location.hostname) ?? '')
    : '';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/staff/partners`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setPartners(data.partners ?? []);
    } catch {
      setError('Could not load partners.');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form: Omit<Partner, 'id'>) => {
    setSaving(true);
    setFormError(null);
    try {
      const isEdit = !!editing;
      const url = isEdit
        ? `${apiBase}/api/staff/partners/${editing!.id}`
        : `${apiBase}/api/staff/partners`;
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setFormError(d.error ?? 'Failed to save.');
        return;
      }
      setEditing(null);
      setAdding(false);
      await load();
    } catch {
      setFormError('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: Partner) => {
    const optimistic = partners.map((x) => x.id === p.id ? { ...x, active: !p.active } : x);
    setPartners(optimistic);
    const res = await fetch(`${apiBase}/api/staff/partners/${p.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    });
    if (!res.ok) setPartners(partners); // revert
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiBase}/api/staff/partners/${confirmDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setConfirmDelete(null);
      await load();
    } catch {
      setError('Failed to delete partner.');
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = partners.filter((p) => p.active).length;

  return (
    <div className="flex flex-col h-full">
      <StaffPageHeader
        title="Partners"
        description="Manage the companies listed on the public partners page."
        action={
          <button
            type="button"
            onClick={() => { setAdding(true); setFormError(null); }}
            className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus size={13} />
            Add partner
          </button>
        }
      />

      {/* Stats */}
      {!loading && !error && (
        <div className="px-8 py-3 flex items-center gap-6 border-b border-white/10 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{activeCount}</span> of {partners.length} visible
          </span>
        </div>
      )}

      <div className="flex-1 overflow-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" /> Loading partners…
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <AlertCircle size={28} className="text-destructive" />
            <p className="text-muted-foreground text-sm">{error}</p>
            <button type="button" onClick={load} className="text-xs text-primary hover:underline">Try again</button>
          </div>
        ) : partners.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <p className="text-muted-foreground">No partners yet.</p>
            <button type="button" onClick={() => setAdding(true)} className="text-sm text-primary hover:underline">Add your first partner</button>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-card/60 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Partner</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Website</th>
                  <th className="text-center px-4 py-3">Visible</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-white/5 last:border-0 transition-colors ${
                      p.active ? 'hover:bg-white/3' : 'opacity-50 hover:bg-white/3'
                    }`}
                  >
                    {/* Logo + name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.logo ? (
                          <div className="h-8 w-12 shrink-0 rounded border border-white/10 bg-white flex items-center justify-center overflow-hidden">
                            <img
                              src={p.logo}
                              alt=""
                              className="h-6 w-10 object-contain"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-12 shrink-0 rounded border border-white/10 bg-card/60" />
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                        {p.category}
                      </span>
                    </td>

                    {/* Website */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {p.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        <ExternalLink size={10} />
                      </a>
                    </td>

                    {/* Active toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        title={p.active ? 'Hide from partners page' : 'Show on partners page'}
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          p.active
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                        }`}
                      >
                        {p.active ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => { setEditing(p); setFormError(null); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setConfirmDelete(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit form */}
      {(adding || editing) && (
        <PartnerForm
          initial={editing ? { name: editing.name, logo: editing.logo, category: editing.category, description: editing.description, website: editing.website, displayOrder: editing.displayOrder, active: editing.active } : BLANK}
          onSave={handleSave}
          onCancel={() => { setAdding(false); setEditing(null); setFormError(null); }}
          saving={saving}
          error={formError}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <DeleteConfirm
          name={confirmDelete.name}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
