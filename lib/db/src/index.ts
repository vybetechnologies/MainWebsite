import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Neon (and most managed Postgres providers) require TLS. node-postgres does
// not always infer this from `sslmode=require` in the URL, so make it explicit.
const useSsl =
  process.env.DATABASE_URL.includes("sslmode=require") ||
  process.env.DATABASE_URL.includes("neon.tech") ||
  process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: true } : undefined,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
