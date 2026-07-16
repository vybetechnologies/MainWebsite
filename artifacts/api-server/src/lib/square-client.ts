import { SquareClient, SquareEnvironment } from "square";

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
