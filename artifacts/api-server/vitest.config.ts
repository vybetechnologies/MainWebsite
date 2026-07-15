import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use the Neon database for integration tests so we exercise the real SQL.
    // DATABASE_URL is what @workspace/db reads; NEON_DATABASE_URL is the secret
    // injected into this Replit environment.
    env: {
      DATABASE_URL: process.env.NEON_DATABASE_URL ?? "",
    },
    // Run each test file in its own pool worker so module-level DB connections
    // are not shared across files.
    pool: "forks",
    // Give integration tests a generous timeout (10 s) for round-trips to Neon.
    testTimeout: 10_000,
  },
});
