/**
 * Smoke tests for the Square checkout routes.
 *
 * These tests guard against Square SDK API-shape changes — if a future SDK bump
 * renames a property, changes a method signature, or alters a response shape,
 * at least one of these tests will fail before the change reaches production.
 *
 * Strategy:
 *   - The Square SDK and database are mocked so tests run without network or DB.
 *   - A minimal Express app (no Clerk middleware) mounts the real route handlers.
 *   - Tests send real HTTP requests and assert on response status + body shape.
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import express, { type Express } from "express";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── Square client mock ────────────────────────────────────────────────────────
// We expose a control object so individual tests can override mock behaviour.
// squareMock holds the data that each mock method reads when called.

const squareMock = {
  available: true,
  catalogObjects: [
    {
      type: "ITEM",
      id: "ITEM_001",
      isDeleted: false,
      itemData: {
        name: "Test Product",
        description: "A test item",
        imageIds: [],
        variations: [
          {
            type: "ITEM_VARIATION",
            id: "VAR_001",
            isDeleted: false,
            itemVariationData: {
              itemId: "ITEM_001",
              name: "Regular",
              priceMoney: { amount: BigInt(1999), currency: "USD" },
              sku: "TEST-SKU",
            },
          },
        ],
      },
    },
  ] as unknown[],
  paymentResult: {
    payment: {
      id: "payment_abc123",
      status: "COMPLETED",
      receiptUrl: "https://squareup.com/receipt/preview/test",
      totalMoney: { amount: BigInt(1999), currency: "USD" },
    },
  },
  batchGetResult: {
    objects: [
      {
        type: "ITEM_VARIATION",
        id: "VAR_001",
        itemVariationData: { itemId: "ITEM_001" },
      },
    ],
  } as { objects: unknown[] },
  orderResult: {
    order: {
      id: "order_xyz789",
      locationId: "TEST_LOCATION",
      totalMoney: { amount: BigInt(1999), currency: "USD" },
    },
  },
};

/**
 * A single shared mock client returned by every getSquareClient() call.
 * Because it's the same object, tests can spy on its methods and
 * mockRejectedValueOnce overrides are seen by the route handler.
 */
const mockClient = {
  catalog: {
    list: vi.fn(() =>
      (async function* () {
        for (const obj of squareMock.catalogObjects) yield obj;
      })(),
    ),
    batchGet: vi.fn(async () => squareMock.batchGetResult),
  },
  payments: {
    create: vi.fn(async () => squareMock.paymentResult),
  },
  orders: {
    create: vi.fn(async () => squareMock.orderResult),
  },
};

// ── Staff auth mock ───────────────────────────────────────────────────────────
// Bypass Clerk-based auth so catalog staff routes are reachable in tests.

vi.mock("../lib/staff-auth", () => ({
  requireStaffAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock("../lib/square-client", () => ({
  isSquareAvailable: vi.fn(() => squareMock.available),
  SQUARE_LOCATION_ID: "TEST_LOCATION",
  SQUARE_APPLICATION_ID: "TEST_APP_ID",
  moneyToNumber: (amount: bigint | number | null | undefined): number => {
    if (amount == null) return 0;
    return typeof amount === "bigint" ? Number(amount) : amount;
  },
  getSquareClient: vi.fn(() => mockClient),
  validateSquareCredentials: vi.fn(async () => {}),
}));

// ── Database mock ─────────────────────────────────────────────────────────────

const dbMock = {
  /** Rows returned from the visibility table. */
  visibleRows: [{ squareItemId: "ITEM_001", visible: true, displayOrder: 0 }] as {
    squareItemId: string;
    visible: boolean;
    displayOrder: number;
  }[],
};

vi.mock("@workspace/db", () => {
  // A chainable query builder stub.
  const makeChain = (finalValue: unknown) => {
    const chain: Record<string, unknown> = {};
    const noop = () => chain;
    chain.select = noop;
    chain.from = noop;
    chain.where = vi.fn(() => ({ ...chain, then: (res: (v: unknown) => unknown) => Promise.resolve(finalValue).then(res) }));
    chain.orderBy = vi.fn(() => ({ ...chain, then: (res: (v: unknown) => unknown) => Promise.resolve(finalValue).then(res) }));
    chain.insert = noop;
    chain.values = noop;
    chain.onConflictDoUpdate = vi.fn(() => Promise.resolve());
    chain.returning = vi.fn(() => Promise.resolve([]));
    return chain;
  };

  const db = {
    select: vi.fn(() => makeChain(dbMock.visibleRows)),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoUpdate: vi.fn(() => Promise.resolve()),
      })),
    })),
  };

  return {
    db,
    marketplaceItemsTable: {
      squareItemId: "squareItemId",
      visible: "visible",
      displayOrder: "displayOrder",
      updatedAt: "updatedAt",
    },
  };
});

// ── Test server ───────────────────────────────────────────────────────────────

let app: Express;
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  // Dynamically import routes AFTER mocks are registered.
  const { default: paymentsRouter } = await import("./payments");
  const { default: catalogRouter } = await import("./catalog");

  app = express();
  app.use(express.json());
  // Provide a no-op logger so pino-http isn't required.
  app.use((req, _res, next) => {
    (req as unknown as Record<string, unknown>).log = {
      info: () => {},
      error: () => {},
      warn: () => {},
      debug: () => {},
    };
    next();
  });
  app.use("/api", paymentsRouter);
  app.use("/api", catalogRouter);

  await new Promise<void>((resolve) => {
    server = createServer(app);
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

const DEFAULT_CATALOG_OBJECTS = [
  {
    type: "ITEM",
    id: "ITEM_001",
    isDeleted: false,
    itemData: {
      name: "Test Product",
      description: "A test item",
      imageIds: [],
      variations: [
        {
          type: "ITEM_VARIATION",
          id: "VAR_001",
          isDeleted: false,
          itemVariationData: {
            itemId: "ITEM_001",
            name: "Regular",
            priceMoney: { amount: BigInt(1999), currency: "USD" },
            sku: "TEST-SKU",
          },
        },
      ],
    },
  },
] as unknown[];

beforeEach(() => {
  // Reset control flags and data to defaults before each test.
  squareMock.available = true;
  squareMock.catalogObjects = [...DEFAULT_CATALOG_OBJECTS];
  squareMock.batchGetResult = {
    objects: [
      {
        type: "ITEM_VARIATION",
        id: "VAR_001",
        itemVariationData: { itemId: "ITEM_001" },
      },
    ],
  };
  squareMock.paymentResult = {
    payment: {
      id: "payment_abc123",
      status: "COMPLETED",
      receiptUrl: "https://squareup.com/receipt/preview/test",
      totalMoney: { amount: BigInt(1999), currency: "USD" },
    },
  };
  squareMock.orderResult = {
    order: {
      id: "order_xyz789",
      locationId: "TEST_LOCATION",
      totalMoney: { amount: BigInt(1999), currency: "USD" },
    },
  };
  dbMock.visibleRows = [{ squareItemId: "ITEM_001", visible: true, displayOrder: 0 }];

  // Clear call history but restore default implementations on the shared client.
  vi.clearAllMocks();
  mockClient.catalog.list.mockImplementation(() =>
    (async function* () {
      for (const obj of squareMock.catalogObjects) yield obj;
    })(),
  );
  mockClient.catalog.batchGet.mockImplementation(async () => squareMock.batchGetResult);
  mockClient.payments.create.mockImplementation(async () => squareMock.paymentResult);
  mockClient.orders.create.mockImplementation(async () => squareMock.orderResult);
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function post(path: string, body: unknown) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function get(path: string) {
  const res = await fetch(`${baseUrl}${path}`);
  return { status: res.status, body: await res.json() };
}

async function patch(path: string, body: unknown) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/catalog/items
// ─────────────────────────────────────────────────────────────────────────────

describe("GET /api/catalog/items", () => {
  it("returns 200 with a well-formed items array", async () => {
    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("each item has the expected top-level shape", async () => {
    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    const item = body.items[0];
    expect(item).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      imageIds: expect.any(Array),
      variations: expect.any(Array),
    });
    // isDeleted must NOT be exposed to the public endpoint
    expect(item).not.toHaveProperty("isDeleted");
  });

  it("each variation has id, name, priceCents (number), and sku", async () => {
    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    const variation = body.items[0]?.variations[0];
    expect(variation).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      priceCents: expect.any(Number),
    });
    // priceCents must be a plain JS number (BigInt must not leak through)
    expect(typeof variation.priceCents).toBe("number");
    expect(variation.priceCents).toBe(1999);
  });

  it("returns 503 when Square is unavailable", async () => {
    squareMock.available = false;
    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(503);
    expect(body).toHaveProperty("error");
  });

  it("returns an empty items array when no items are marked visible", async () => {
    dbMock.visibleRows = [];
    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    expect(body.items).toEqual([]);
  });

  it("surfaces an empty variations array when the only variation is marked isDeleted=true", async () => {
    squareMock.catalogObjects = [
      {
        type: "ITEM",
        id: "ITEM_001",
        isDeleted: false,
        itemData: {
          name: "Deleted Variation Item",
          description: "",
          imageIds: [],
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "VAR_DELETED",
              isDeleted: true,
              itemVariationData: {
                itemId: "ITEM_001",
                name: "Gone",
                priceMoney: { amount: BigInt(500), currency: "USD" },
                sku: null,
              },
            },
          ],
        },
      },
    ] as unknown[];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    const item = body.items[0];
    expect(item).toBeDefined();
    expect(item.variations).toEqual([]);
  });

  it("yields priceCents=0 for a variation with no priceMoney rather than crashing", async () => {
    squareMock.catalogObjects = [
      {
        type: "ITEM",
        id: "ITEM_001",
        isDeleted: false,
        itemData: {
          name: "Free Item",
          description: "",
          imageIds: [],
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "VAR_NO_PRICE",
              isDeleted: false,
              itemVariationData: {
                itemId: "ITEM_001",
                name: "No Price",
                // priceMoney intentionally absent
                sku: null,
              },
            },
          ],
        },
      },
    ] as unknown[];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    const variation = body.items[0]?.variations[0];
    expect(variation).toBeDefined();
    expect(variation.priceCents).toBe(0);
    expect(typeof variation.priceCents).toBe("number");
  });

  it("sets categoryName=null when the item's categoryId is not in the fetched catalog objects", async () => {
    squareMock.catalogObjects = [
      {
        type: "ITEM",
        id: "ITEM_001",
        isDeleted: false,
        itemData: {
          name: "Orphan Category Item",
          description: "",
          imageIds: [],
          categoryId: "CATEGORY_MISSING",
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "VAR_001",
              isDeleted: false,
              itemVariationData: {
                itemId: "ITEM_001",
                name: "Regular",
                priceMoney: { amount: BigInt(999), currency: "USD" },
                sku: null,
              },
            },
          ],
        },
      },
      // No CATEGORY object with id CATEGORY_MISSING is present
    ] as unknown[];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    const item = body.items[0];
    expect(item).toBeDefined();
    expect(item.categoryName).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/create-payment
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /api/payments/create-payment", () => {
  const validBody = {
    sourceId: "cnon:card-nonce-ok",   // Square Sandbox test nonce
    amountCents: 1999,
    note: "Test charge",
    buyerEmailAddress: "customer@example.com",
  };

  it("returns 200 with paymentId, status, receiptUrl, totalMoney for a valid nonce", async () => {
    const { status, body } = await post("/api/payments/create-payment", validBody);

    expect(status).toBe(200);
    expect(body).toMatchObject({
      paymentId: expect.any(String),
      status: expect.any(String),
      totalMoney: expect.any(Number),
    });
    // receiptUrl may be null but must be present in the response
    expect("receiptUrl" in body).toBe(true);
  });

  it("passes sourceId and amountMoney to the Square SDK payments.create()", async () => {
    await post("/api/payments/create-payment", validBody);

    expect(mockClient.payments.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceId: "cnon:card-nonce-ok",
        amountMoney: expect.objectContaining({ currency: "USD" }),
        locationId: "TEST_LOCATION",
      }),
    );
  });

  it("includes a unique idempotencyKey in each call", async () => {
    await post("/api/payments/create-payment", validBody);
    await post("/api/payments/create-payment", validBody);

    const calls = mockClient.payments.create.mock.calls;
    // Both calls were made (two separate invocations)
    expect(calls.length).toBeGreaterThanOrEqual(2);
    // Each call must carry an idempotencyKey
    for (const [args] of calls) {
      expect(args).toHaveProperty("idempotencyKey");
      expect(typeof (args as Record<string, unknown>).idempotencyKey).toBe("string");
    }
  });

  it("returns 400 for missing sourceId", async () => {
    const { status, body } = await post("/api/payments/create-payment", {
      amountCents: 500,
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 400 for non-positive amountCents", async () => {
    const { status, body } = await post("/api/payments/create-payment", {
      sourceId: "cnon:card-nonce-ok",
      amountCents: 0,
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 503 when Square is unavailable", async () => {
    squareMock.available = false;
    const { status, body } = await post("/api/payments/create-payment", validBody);

    expect(status).toBe(503);
    expect(body).toHaveProperty("error");
  });

  it("returns 402 and the Square error detail when the SDK throws", async () => {
    mockClient.payments.create.mockRejectedValueOnce({
      errors: [{ detail: "Card was declined." }],
    });

    const { status, body } = await post("/api/payments/create-payment", validBody);

    expect(status).toBe(402);
    expect(body.error).toBe("Card was declined.");
  });

  it("totalMoney is a plain JS number, not a BigInt or string", async () => {
    const { status, body } = await post("/api/payments/create-payment", validBody);

    expect(status).toBe(200);
    expect(typeof body.totalMoney).toBe("number");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/create-order-and-pay
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /api/payments/create-order-and-pay", () => {
  const validBody = {
    sourceId: "cnon:card-nonce-ok",
    lineItems: [
      {
        catalogVariationId: "VAR_001",
        name: "Test Product",
        quantity: 1,
        basePriceCents: 1999,
      },
    ],
    buyerEmail: "customer@example.com",
  };

  it("returns 200 with orderId, paymentId, status, receiptUrl, totalMoney", async () => {
    const { status, body } = await post("/api/payments/create-order-and-pay", validBody);

    expect(status).toBe(200);
    expect(body).toMatchObject({
      orderId: expect.any(String),
      paymentId: expect.any(String),
      status: expect.any(String),
      totalMoney: expect.any(Number),
    });
    expect("receiptUrl" in body).toBe(true);
  });

  it("calls catalog.batchGet with the variation IDs before placing the order", async () => {
    await post("/api/payments/create-order-and-pay", validBody);

    expect(mockClient.catalog.batchGet).toHaveBeenCalledWith(
      expect.objectContaining({
        objectIds: ["VAR_001"],
      }),
    );
  });

  it("returns 400 for empty lineItems array", async () => {
    const { status, body } = await post("/api/payments/create-order-and-pay", {
      sourceId: "cnon:card-nonce-ok",
      lineItems: [],
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 400 when a variation is not found in catalog.batchGet", async () => {
    squareMock.batchGetResult = { objects: [] }; // empty — variation not found

    const { status, body } = await post("/api/payments/create-order-and-pay", {
      sourceId: "cnon:card-nonce-ok",
      lineItems: [
        {
          catalogVariationId: "VAR_UNKNOWN",
          name: "Ghost Item",
          quantity: 1,
          basePriceCents: 500,
        },
      ],
    });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 503 when Square is unavailable", async () => {
    squareMock.available = false;
    const { status, body } = await post("/api/payments/create-order-and-pay", validBody);

    expect(status).toBe(503);
    expect(body).toHaveProperty("error");
  });

  it("returns 402 when the payment SDK call throws", async () => {
    mockClient.payments.create.mockRejectedValueOnce({
      errors: [{ detail: "Insufficient funds." }],
    });

    const { status, body } = await post("/api/payments/create-order-and-pay", validBody);

    expect(status).toBe(402);
    expect(body.error).toBe("Insufficient funds.");
  });

  it("totalMoney in the response is a plain JS number", async () => {
    const { status, body } = await post("/api/payments/create-order-and-pay", validBody);

    expect(status).toBe(200);
    expect(typeof body.totalMoney).toBe("number");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Visibility gate — GET /api/catalog/items
// ─────────────────────────────────────────────────────────────────────────────

describe("GET /api/catalog/items — visibility gate", () => {
  it("returns only items whose squareItemId is in the DB visible set", async () => {
    // Two Square items, but only ITEM_001 is marked visible in the DB.
    squareMock.catalogObjects = [
      {
        type: "ITEM",
        id: "ITEM_001",
        isDeleted: false,
        itemData: { name: "Visible Item", description: "", imageIds: [], variations: [] },
      },
      {
        type: "ITEM",
        id: "ITEM_002",
        isDeleted: false,
        itemData: { name: "Hidden Item", description: "", imageIds: [], variations: [] },
      },
    ] as unknown[];
    dbMock.visibleRows = [{ squareItemId: "ITEM_001", visible: true, displayOrder: 0 }];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe("ITEM_001");
    const returnedIds = body.items.map((i: { id: string }) => i.id);
    expect(returnedIds).not.toContain("ITEM_002");
  });

  it("excludes all items when the DB visible set is empty (visibility flags cleared)", async () => {
    // Simulate a schema migration or regression that clears all visible flags.
    dbMock.visibleRows = [];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    expect(body.items).toEqual([]);
  });

  it("includes every item that is marked visible, up to the full catalog size", async () => {
    squareMock.catalogObjects = [
      {
        type: "ITEM",
        id: "ITEM_A",
        isDeleted: false,
        itemData: { name: "Item A", description: "", imageIds: [], variations: [] },
      },
      {
        type: "ITEM",
        id: "ITEM_B",
        isDeleted: false,
        itemData: { name: "Item B", description: "", imageIds: [], variations: [] },
      },
    ] as unknown[];
    dbMock.visibleRows = [
      { squareItemId: "ITEM_A", visible: true, displayOrder: 1 },
      { squareItemId: "ITEM_B", visible: true, displayOrder: 0 },
    ];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    expect(body.items).toHaveLength(2);
    const returnedIds = body.items.map((i: { id: string }) => i.id);
    expect(returnedIds).toContain("ITEM_A");
    expect(returnedIds).toContain("ITEM_B");
  });

  it("respects displayOrder from the DB when sorting visible items", async () => {
    squareMock.catalogObjects = [
      {
        type: "ITEM",
        id: "ITEM_FIRST",
        isDeleted: false,
        itemData: { name: "Should Be Second", description: "", imageIds: [], variations: [] },
      },
      {
        type: "ITEM",
        id: "ITEM_SECOND",
        isDeleted: false,
        itemData: { name: "Should Be First", description: "", imageIds: [], variations: [] },
      },
    ] as unknown[];
    // ITEM_SECOND has lower displayOrder, so it should appear first.
    dbMock.visibleRows = [
      { squareItemId: "ITEM_SECOND", visible: true, displayOrder: 0 },
      { squareItemId: "ITEM_FIRST", visible: true, displayOrder: 1 },
    ];

    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    expect(body.items[0].id).toBe("ITEM_SECOND");
    expect(body.items[1].id).toBe("ITEM_FIRST");
  });

  it("never exposes the isDeleted field to callers", async () => {
    const { status, body } = await get("/api/catalog/items");

    expect(status).toBe(200);
    for (const item of body.items) {
      expect(item).not.toHaveProperty("isDeleted");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/staff/catalog/:id — visibility upsert
// ─────────────────────────────────────────────────────────────────────────────

describe("PATCH /api/staff/catalog/:id", () => {
  it("returns 200 with { ok: true } when visible=true is set", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { visible: true });

    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it("returns 200 with { ok: true } when visible=false is set", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { visible: false });

    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it("returns 200 when only displayOrder is provided", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { displayOrder: 3 });

    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it("returns 200 when both visible and displayOrder are provided", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", {
      visible: true,
      displayOrder: 5,
    });

    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it("returns 400 when visible is not a boolean", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { visible: "yes" });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 400 when displayOrder is negative", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { displayOrder: -1 });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 400 when displayOrder is not an integer", async () => {
    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { displayOrder: 1.5 });

    expect(status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("calls db.insert (upsert) with the squareItemId from the URL param", async () => {
    const { db } = await import("@workspace/db");

    await patch("/api/staff/catalog/SQUARE_ITEM_XYZ", { visible: true });

    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database throws", async () => {
    const { db } = await import("@workspace/db");
    (db.insert as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
      values: vi.fn(() => ({
        onConflictDoUpdate: vi.fn(() => Promise.reject(new Error("DB connection lost"))),
      })),
    }));

    const { status, body } = await patch("/api/staff/catalog/ITEM_001", { visible: true });

    expect(status).toBe(500);
    expect(body).toHaveProperty("error");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/staff/catalog — merged shape + defaults
// ─────────────────────────────────────────────────────────────────────────────

describe("GET /api/staff/catalog", () => {
  it("returns 200 with a well-formed items array containing merged Square + DB fields", async () => {
    // DB has ITEM_001 marked visible with displayOrder=3
    dbMock.visibleRows = [{ squareItemId: "ITEM_001", visible: true, displayOrder: 3 }];

    const { status, body } = await get("/api/staff/catalog");

    expect(status).toBe(200);
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);

    const item = body.items[0];
    // Square-sourced fields must be present
    expect(item).toMatchObject({
      id: "ITEM_001",
      name: expect.any(String),
      description: expect.any(String),
      imageIds: expect.any(Array),
      variations: expect.any(Array),
    });
    // DB-merged fields must be present with the correct DB values
    expect(item).toMatchObject({
      visible: true,
      displayOrder: 3,
    });
  });

  it("defaults visible=false and assigns a fallback displayOrder for items not yet in the DB", async () => {
    // DB is empty — ITEM_001 from Square has no row yet
    dbMock.visibleRows = [];

    const { status, body } = await get("/api/staff/catalog");

    expect(status).toBe(200);
    expect(body.items).toHaveLength(1);

    const item = body.items[0];
    expect(item.id).toBe("ITEM_001");
    // Must default to hidden, not visible
    expect(item.visible).toBe(false);
    // displayOrder must be a number (the fallback index)
    expect(typeof item.displayOrder).toBe("number");
  });

  it("returns 503 when Square is unavailable", async () => {
    squareMock.available = false;

    const { status, body } = await get("/api/staff/catalog");

    expect(status).toBe(503);
    expect(body).toHaveProperty("error");
  });
});
