'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2, AlertCircle, Plus, Pencil, Trash2, X, ExternalLink, RefreshCw,
} from 'lucide-react';
import { resolveApiBaseUrl } from '@/lib/api-base';
import { StaffPageHeader } from '@/app/staff/staff-shell';
import { NEWS_CATEGORY_LABELS, type NewsCategory } from '@/lib/sanity/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArticleSummary {
  _id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  publishedAt: string;
  summary: string;
}

interface ArticleDetail extends ArticleSummary {
  bodyText: string;
}

interface FormState {
  title: string;
  slug: string;
  category: NewsCategory | '';
  publishedAt: string;
  summary: string;
  bodyText: string;
}

const BLANK: FormState = {
  title: '',
  slug: '',
  category: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  summary: '',
  bodyText: '',
};

const CATEGORIES = Object.entries(NEWS_CATEGORY_LABELS) as [NewsCategory, string][];

// ── Slug helper ───────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);
}

// ── Article form panel ────────────────────────────────────────────────────────

function ArticleForm({
  initial, onSave, onCancel, saving, error,
}: {
  initial: FormState;
  onSave: (form: FormState) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.title);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleTitleChange = (title: string) => {
    set('title', title);
    if (!slugTouched) set('slug', slugify(title));
  };

  const valid = form.title.trim() && form.slug.trim() && form.category && form.publishedAt && form.summary.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="font-display font-semibold text-base">
            {initial.title ? 'Edit article' : 'New article'}
          </h2>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
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

          <div className="grid grid-cols-2 gap-4">
            <Field label="Title" required className="col-span-2">
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article headline"
                className={inputCls}
              />
            </Field>

            <Field label="Slug" required hint="URL path — auto-generated, edit if needed">
              <input
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')); }}
                placeholder="my-article-slug"
                className={inputCls}
              />
            </Field>

            <Field label="Publish date" required>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => set('publishedAt', e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Category" required className="col-span-2">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as NewsCategory)}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </Field>

            <Field label="Summary" required hint="1–2 sentence preview shown on the newsroom listing" className="col-span-2">
              <textarea
                value={form.summary}
                onChange={(e) => set('summary', e.target.value)}
                rows={2}
                placeholder="Brief description of this article…"
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field
              label="Body"
              hint="Full article text. Separate paragraphs with a blank line."
              className="col-span-2"
            >
              <textarea
                value={form.bodyText}
                onChange={(e) => set('bodyText', e.target.value)}
                rows={12}
                placeholder={"Write the article body here.\n\nEach blank line creates a new paragraph."}
                className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
              />
            </Field>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Note: Image upload is managed via{' '}
            <a href="https://sanity.io/manage" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Sanity Studio
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !valid}
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {initial.title ? 'Save changes' : 'Publish article'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, hint, className, children }: {
  label: string; required?: boolean; hint?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
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

function DeleteConfirm({ title, onConfirm, onCancel, deleting }: {
  title: string; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold">Delete article?</h2>
        <p className="text-sm text-muted-foreground">
          This permanently deletes <span className="font-medium text-foreground">{title}</span> from Sanity. This cannot be undone.
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Category badge ────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'press-release': 'bg-blue-500/10 text-blue-400',
  'product-announcement': 'bg-violet-500/10 text-violet-400',
  'company-news': 'bg-primary/10 text-primary',
  'community-initiative': 'bg-emerald-500/10 text-emerald-400',
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[category] ?? 'bg-white/10 text-foreground'}`}>
      {NEWS_CATEGORY_LABELS[category as NewsCategory] ?? category}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function NewsroomContent() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ArticleDetail | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<ArticleSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const apiBase = typeof window !== 'undefined'
    ? (resolveApiBaseUrl(window.location.hostname) ?? '')
    : '';

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true); else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/staff/newsroom`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setArticles(data.articles ?? []);
    } catch {
      setError('Could not load articles from Sanity.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiBase]);

  useEffect(() => { load(); }, [load]);

  // Load full article for editing
  const openEdit = async (article: ArticleSummary) => {
    setLoadingEdit(article._id);
    setFormError(null);
    try {
      const res = await fetch(`${apiBase}/api/staff/newsroom/${encodeURIComponent(article._id)}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEditing(data.article);
    } catch {
      setError('Could not load article for editing.');
    } finally {
      setLoadingEdit(null);
    }
  };

  const handleSave = async (form: FormState) => {
    setSaving(true);
    setFormError(null);
    try {
      const isEdit = !!editing;
      const url = isEdit
        ? `${apiBase}/api/staff/newsroom/${encodeURIComponent(editing!._id)}`
        : `${apiBase}/api/staff/newsroom`;
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
      setAdding(false);
      setEditing(null);
      await load(true);
    } catch {
      setFormError('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiBase}/api/staff/newsroom/${encodeURIComponent(confirmDelete._id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setConfirmDelete(null);
      await load(true);
    } catch {
      setError('Failed to delete article.');
      setDeleting(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col h-full">
      <StaffPageHeader
        title="Newsroom"
        description="Create, edit, and delete articles published to the public newsroom."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => { setAdding(true); setFormError(null); }}
              className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus size={13} />
              New article
            </button>
          </div>
        }
      />

      {/* Stats */}
      {!loading && !error && (
        <div className="px-8 py-3 flex items-center gap-6 border-b border-white/10 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{articles.length}</span> article{articles.length !== 1 ? 's' : ''}
          </span>
          <a
            href="/newsroom"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View public newsroom <ExternalLink size={10} />
          </a>
        </div>
      )}

      <div className="flex-1 overflow-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" /> Loading articles…
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <AlertCircle size={28} className="text-destructive" />
            <p className="text-muted-foreground text-sm">{error}</p>
            <button type="button" onClick={() => load()} className="text-xs text-primary hover:underline">Try again</button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <p className="text-muted-foreground">No articles yet.</p>
            <button type="button" onClick={() => setAdding(true)} className="text-sm text-primary hover:underline">
              Write your first article
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-card/60 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    {/* Title + summary */}
                    <td className="px-4 py-3">
                      <p className="font-medium leading-snug">{article.title}</p>
                      {article.summary && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">{article.summary}</p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <CategoryBadge category={article.category} />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground tabular-nums">
                      {article.publishedAt ? formatDate(article.publishedAt) : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={`/newsroom/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View article"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          type="button"
                          title="Edit"
                          disabled={loadingEdit === article._id}
                          onClick={() => openEdit(article)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors disabled:opacity-40"
                        >
                          {loadingEdit === article._id ? <Loader2 size={13} className="animate-spin" /> : <Pencil size={13} />}
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setConfirmDelete(article)}
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

      {/* Form modal */}
      {(adding || editing) && (
        <ArticleForm
          initial={editing
            ? { title: editing.title, slug: editing.slug, category: editing.category, publishedAt: editing.publishedAt?.slice(0, 10) ?? '', summary: editing.summary, bodyText: editing.bodyText ?? '' }
            : BLANK
          }
          onSave={handleSave}
          onCancel={() => { setAdding(false); setEditing(null); setFormError(null); }}
          saving={saving}
          error={formError}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <DeleteConfirm
          title={confirmDelete.title}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
