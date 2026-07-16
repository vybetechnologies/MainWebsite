import { SquareClient, SquareEnvironment } from "square";
import { logger } from "./logger";

/** Always create a fresh client — never cache it (token may rotate). */
export function getSquareClient(): SquareClient {
  return new SquareClient({
    token: process.env["SQUARE_ACCESS_TOKEN"]!,
    environment: SquareEnvironment.Production,
  });
}

export const SQUARE_LOCATION_ID = process.env["SQUARE_LOCATION_ID"]!;
export const SQUARE_APPLICATION_ID = process.env["SQUARE_APPLICATION_ID"]!;

/** Safely convert a Square BigInt money amount to a plain JS number. */
export function moneyToNumber(amount: bigint | number | null | undefined): number {
  if (amount == null) return 0;
  return typeof amount === "bigint" ? Number(amount) : amount;
}

// ── Startup validation ────────────────────────────────────────────────────────

let _squareAvailable = false;

/** Returns true only after validateSquareCredentials() has run and passed. */
export function isSquareAvailable(): boolean {
  return _squareAvailable;
}

/**
 * Called once at server startup. Checks that required env vars are set and
 * that the token is accepted by Square's API. Sets the module-level
 * `_squareAvailable` flag — Square routes return 503 when it is false.
 */
export async function validateSquareCredentials(): Promise<void> {
  const token = process.env["SQUARE_ACCESS_TOKEN"];
  const locationId = process.env["SQUARE_LOCATION_ID"];

  if (!token || token.trim() === "") {
    logger.error("SQUARE_ACCESS_TOKEN is missing or empty — Square routes will be unavailable");
    return;
  }

  if (!locationId || locationId.trim() === "") {
    logger.error("SQUARE_LOCATION_ID is missing or empty — Square routes will be unavailable");
    return;
  }

  try {
    const client = new SquareClient({
      token,
      environment: SquareEnvironment.Production,
    });

    // Lightweight call to verify the token is accepted by Square.
    // locations.list() returns a plain response object (not a paginated iterable).
    const response = await client.locations.list();
    const locationCount = response.locations?.length ?? 0;

    _squareAvailable = true;
    logger.info({ locationCount }, "Square credentials validated — Square routes available");
  } catch (err) {
    logger.error(
      { err },
      "Square credential check failed (invalid or revoked token?) — Square routes will be unavailable",
    );
  }
}
