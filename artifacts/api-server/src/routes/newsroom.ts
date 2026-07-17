import { Router, type IRouter } from "express";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

// ── Sanity HTTP helpers ───────────────────────────────────────────────────────

function sanityBase() {
  const projectId = process.env["SANITY_PROJECT_ID"];
  const dataset = process.env["SANITY_DATASET"] ?? "production";
  if (!projectId) throw new Error("SANITY_PROJECT_ID is not set");
  return { projectId, dataset };
}

function sanityToken() {
  const token = process.env["SANITY_API_TOKEN"];
  if (!token) throw new Error("SANITY_API_TOKEN is not set");
  return token;
}

async function sanityQuery<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const { projectId, dataset } = sanityBase();
  const token = sanityToken();
  const url = new URL(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(`$${k}`, JSON.stringify(v));
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = await res.json() as { result: T };
  return json.result;
}

async function sanityMutate(mutations: unknown[]): Promise<unknown> {
  const { projectId, dataset } = sanityBase();
  const token = sanityToken();
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutation failed: ${res.status} — ${text}`);
  }
  return res.json();
}

// ── PortableText helpers ──────────────────────────────────────────────────────

function bodyToText(body: unknown[]): string {
  if (!Array.isArray(body)) return "";
  return body
    .filter((b: any) => b._type === "block")
    .map((b: any) =>
      ((b.children as any[]) ?? []).map((c: any) => c.text ?? "").join(""),
    )
    .join("\n\n");
}

function textToBody(text: string): unknown[] {
  const now = Date.now();
  return text
    .split(/\n\n+/)
    .map((para, i) => para.trim())
    .filter(Boolean)
    .map((para, i) => ({
      _type: "block",
      _key: `b${now}${i}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `s${now}${i}`, text: para, marks: [] }],
    }));
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// ── Staff: list all articles ──────────────────────────────────────────────────

router.get("/staff/newsroom", requireStaffAuth, async (req, res): Promise<void> => {
  try {
    const articles = await sanityQuery<unknown[]>(
      `*[_type == "newsArticle"] | order(publishedAt desc) {
        _id, title, "slug": slug.current, category, publishedAt, summary
      }`,
    );
    // Extract body as plain text separately when needed for editing
    res.json({ articles: articles ?? [] });
  } catch (err) {
    req.log.error({ err }, "Failed to load newsroom articles");
    res.status(500).json({ error: "Failed to load articles" });
  }
});

// ── Staff: get single article (with body) ─────────────────────────────────────

router.get("/staff/newsroom/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const id = req.params["id"] as string;
  try {
    const article = await sanityQuery<any>(
      `*[_type == "newsArticle" && _id == $id][0]{
        _id, title, "slug": slug.current, category, publishedAt, summary, body
      }`,
      { id },
    );
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    // Convert body to plain text for editing
    res.json({ article: { ...article, bodyText: bodyToText(article.body ?? []) } });
  } catch (err) {
    req.log.error({ err }, "Failed to load article");
    res.status(500).json({ error: "Failed to load article" });
  }
});

// ── Staff: create article ─────────────────────────────────────────────────────

router.post("/staff/newsroom", requireStaffAuth, async (req, res): Promise<void> => {
  const { title, slug, category, publishedAt, summary, bodyText } = req.body as Record<string, string>;
  if (!title?.trim() || !category || !publishedAt || !summary?.trim()) {
    res.status(400).json({ error: "title, category, publishedAt, and summary are required" });
    return;
  }
  const finalSlug = slug?.trim() || slugify(title);
  try {
    // Check slug is unique
    const existing = await sanityQuery<unknown[]>(
      `*[_type == "newsArticle" && slug.current == $slug]._id`,
      { slug: finalSlug },
    );
    if (existing.length > 0) {
      res.status(409).json({ error: `Slug "${finalSlug}" is already in use. Choose a different one.` });
      return;
    }
    await sanityMutate([{
      create: {
        _type: "newsArticle",
        title: title.trim(),
        slug: { _type: "slug", current: finalSlug },
        category,
        publishedAt,
        summary: summary.trim(),
        body: textToBody(bodyText ?? ""),
      },
    }]);
    res.status(201).json({ ok: true, slug: finalSlug });
  } catch (err: any) {
    req.log.error({ err }, "Failed to create article");
    res.status(500).json({ error: err.message ?? "Failed to create article" });
  }
});

// ── Staff: update article ─────────────────────────────────────────────────────

router.patch("/staff/newsroom/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const id = req.params["id"] as string;
  const { title, slug, category, publishedAt, summary, bodyText } = req.body as Record<string, string>;
  try {
    const patch: Record<string, unknown> = {};
    if (title?.trim()) patch["title"] = title.trim();
    if (slug?.trim()) patch["slug"] = { _type: "slug", current: slug.trim() };
    if (category) patch["category"] = category;
    if (publishedAt) patch["publishedAt"] = publishedAt;
    if (summary?.trim()) patch["summary"] = summary.trim();
    if (typeof bodyText === "string") patch["body"] = textToBody(bodyText);
    if (Object.keys(patch).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    await sanityMutate([{ patch: { id, set: patch } }]);
    res.json({ ok: true });
  } catch (err: any) {
    req.log.error({ err }, "Failed to update article");
    res.status(500).json({ error: err.message ?? "Failed to update article" });
  }
});

// ── Staff: delete article ─────────────────────────────────────────────────────

router.delete("/staff/newsroom/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const id = req.params["id"] as string;
  try {
    await sanityMutate([{ delete: { id } }]);
    res.json({ ok: true });
  } catch (err: any) {
    req.log.error({ err }, "Failed to delete article");
    res.status(500).json({ error: err.message ?? "Failed to delete article" });
  }
});

export default router;
