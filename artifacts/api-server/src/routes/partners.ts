import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import {
  db,
  partnersTable,
  insertPartnerSchema,
  updatePartnerSchema,
} from "@workspace/db";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

// ── Default seed data ─────────────────────────────────────────────────────────

export const DEFAULT_PARTNERS = [
  { name: "Microsoft", logo: "/partners/microsoft.png", category: "Cloud & Software", description: "As a Microsoft AI Cloud Partner, we deliver Microsoft's full commercial portfolio — from Microsoft 365 and Azure cloud services to Windows-based business solutions for teams of every size.", website: "https://microsoft.com", displayOrder: 0 },
  { name: "Google", logo: "/partners/google.svg", category: "Cloud & Workspace", description: "Our Google partnership gives customers access to Google Workspace and Google Cloud solutions — collaboration tools, storage, and enterprise-grade infrastructure backed by Google's global network.", website: "https://google.com", displayOrder: 1 },
  { name: "Apple", logo: "/partners/apple.svg", category: "Device Service", description: "VYBE Technologies is authorized to service Apple devices. Our Tech Rescue technicians handle iPhone, iPad, Mac, and Apple Watch repairs with genuine parts and proper diagnostic tools.", website: "https://apple.com", displayOrder: 2 },
  { name: "Samsung", logo: "/partners/samsung.svg", category: "Device Service", description: "Certified to repair Samsung smartphones, tablets, and devices. From Galaxy screen replacements to software issues, our team handles Samsung hardware with the care it deserves.", website: "https://samsung.com", displayOrder: 3 },
  { name: "Cloudflare", logo: "/partners/cloudflare.png", category: "Infrastructure", description: "Our customer-facing websites run on Cloudflare Pages and are protected by Cloudflare's global edge network — delivering fast load times, DDoS protection, and zero-trust security at scale.", website: "https://cloudflare.com", displayOrder: 4 },
  { name: "Fly.io", logo: "/partners/flyio.png", category: "Infrastructure", description: "VYBE's API and backend services are deployed on Fly.io's globally distributed compute platform — giving our applications low-latency, resilient infrastructure close to our users.", website: "https://fly.io", displayOrder: 5 },
  { name: "Neon", logo: "/partners/neon.svg", category: "Infrastructure", description: "Our production databases run on Neon's serverless Postgres platform — delivering autoscaling, branching, and instant provisioning for modern application workloads.", website: "https://neon.tech", displayOrder: 6 },
  { name: "Pax8", logo: "/partners/pax8.png", category: "Cloud Marketplace", description: "Through our Pax8 partnership, we source and deliver hundreds of leading cloud products to business customers — simplifying procurement, licensing, and support under one roof.", website: "https://pax8.com", displayOrder: 7 },
  { name: "iFixit", logo: "/partners/ifixit.svg", category: "Repair & Parts", description: "iFixit is the world's largest open repair community and a trusted source for quality device parts. Their repair guides and components power a significant part of our Tech Rescue toolkit.", website: "https://ifixit.com", displayOrder: 8 },
  { name: "Mobilesentrix", logo: "/partners/mobilesentrix.png", category: "Repair & Parts", description: "Mobilesentrix is a premier wholesale distributor of mobile device replacement parts. Our partnership ensures our repair inventory is stocked with high-quality components at competitive prices.", website: "https://mobilesentrix.com", displayOrder: 9 },
  { name: "Square", logo: "/partners/square.svg", category: "Payments", description: "VYBE Technologies uses Square to power secure, seamless payments across the platform — from Tech Rescue repair deposits and staff-generated invoices to full catalog checkout in the VYBE Marketplace.", website: "https://squareup.com", displayOrder: 10 },
  { name: "Stripe", logo: "/partners/stripe.svg", category: "Payments", description: "Stripe powers VYBE's global payout infrastructure, enabling earnings to flow directly to customer wallets and bank accounts across 46+ countries.", website: "https://stripe.com", displayOrder: 11 },
  { name: "Ooma Office", logo: "/partners/ooma.svg", category: "Communications", description: "Ooma Office powers VYBE's business phone system with cloud-based VoIP built for small and growing teams. As an authorized Ooma reseller, we also deploy Ooma Office for our clients.", website: "https://www.ooma.com/office/", displayOrder: 12 },
  { name: "Bitdefender", logo: "/partners/bitdefender.svg", category: "Cybersecurity", description: "Bitdefender provides enterprise-grade endpoint protection across VYBE's internal systems and client environments. As a Bitdefender partner, we deploy and manage their award-winning antivirus and EDR solutions.", website: "https://www.bitdefender.com", displayOrder: 13 },
  { name: "SentinelOne", logo: "/partners/sentinelone.svg", category: "Cybersecurity", description: "SentinelOne's AI-powered endpoint security platform is part of VYBE's advanced threat protection stack. We leverage SentinelOne to deliver autonomous detection and response for clients.", website: "https://www.sentinelone.com", displayOrder: 14 },
  { name: "Bluevine", logo: "/partners/bluevine.svg", category: "Banking & Finance", description: "Bluevine provides VYBE Technologies with modern business banking built for growth — including high-yield checking, lines of credit, and bill pay.", website: "https://bluevine.com", displayOrder: 15 },
  { name: "Wave Advisors", logo: "/partners/wave.svg", category: "Banking & Finance", description: "Wave Advisors supports VYBE's financial operations with expert accounting, bookkeeping, and advisory services — helping us maintain clean books, stay tax-ready, and make data-driven decisions.", website: "https://waveapps.com", displayOrder: 16 },
];

// ── Seed helper (called at startup) ──────────────────────────────────────────

export async function seedPartnersIfEmpty(): Promise<void> {
  const existing = await db.select({ id: partnersTable.id }).from(partnersTable).limit(1);
  if (existing.length > 0) return;
  await db.insert(partnersTable).values(DEFAULT_PARTNERS);
}

// ── Public: list active partners ──────────────────────────────────────────────

router.get("/partners", async (req, res): Promise<void> => {
  try {
    const partners = await db
      .select()
      .from(partnersTable)
      .where(eq(partnersTable.active, true))
      .orderBy(asc(partnersTable.displayOrder), asc(partnersTable.id));
    res.json({ partners });
  } catch (err) {
    req.log.error({ err }, "Failed to load partners");
    res.status(500).json({ error: "Failed to load partners" });
  }
});

// ── Staff: list all partners ──────────────────────────────────────────────────

router.get("/staff/partners", requireStaffAuth, async (req, res): Promise<void> => {
  try {
    const partners = await db
      .select()
      .from(partnersTable)
      .orderBy(asc(partnersTable.displayOrder), asc(partnersTable.id));
    res.json({ partners });
  } catch (err) {
    req.log.error({ err }, "Failed to load partners");
    res.status(500).json({ error: "Failed to load partners" });
  }
});

// ── Staff: create a partner ───────────────────────────────────────────────────

router.post("/staff/partners", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = insertPartnerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid partner data", details: parsed.error.issues });
    return;
  }
  try {
    const [partner] = await db.insert(partnersTable).values(parsed.data).returning();
    res.status(201).json({ partner });
  } catch (err) {
    req.log.error({ err }, "Failed to create partner");
    res.status(500).json({ error: "Failed to create partner" });
  }
});

// ── Staff: update a partner ───────────────────────────────────────────────────

router.patch("/staff/partners/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid partner id" });
    return;
  }
  const parsed = updatePartnerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid update data", details: parsed.error.issues });
    return;
  }
  try {
    const [partner] = await db
      .update(partnersTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(partnersTable.id, id))
      .returning();
    if (!partner) {
      res.status(404).json({ error: "Partner not found" });
      return;
    }
    res.json({ partner });
  } catch (err) {
    req.log.error({ err }, "Failed to update partner");
    res.status(500).json({ error: "Failed to update partner" });
  }
});

// ── Staff: delete a partner ───────────────────────────────────────────────────

router.delete("/staff/partners/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid partner id" });
    return;
  }
  try {
    const [deleted] = await db
      .delete(partnersTable)
      .where(eq(partnersTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Partner not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete partner");
    res.status(500).json({ error: "Failed to delete partner" });
  }
});

export default router;
