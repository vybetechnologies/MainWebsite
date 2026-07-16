/**
 * Square Web Payments SDK loader + config fetcher.
 * Loads square.js from Square's CDN, initializes a Payments instance,
 * and exposes helpers for the card payment form.
 */

// Minimal types for the Square Web Payments SDK (no official @types package).
export interface SquareCard {
  attach(selector: string): Promise<void>;
  tokenize(): Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy(): Promise<void>;
}

export interface SquarePayments {
  card(options?: Record<string, unknown>): Promise<SquareCard>;
}

interface SquarePublicConfig {
  squareApplicationId: string;
  squareLocationId: string;
}

declare global {
  interface Window {
    Square?: {
      payments(applicationId: string, locationId: string): SquarePayments;
    };
  }
}

let configCache: SquarePublicConfig | null = null;

export async function getSquareConfig(apiBase: string): Promise<SquarePublicConfig> {
  if (configCache) return configCache;
  const res = await fetch(`${apiBase}/api/config/public`);
  if (!res.ok) throw new Error("Could not load Square configuration.");
  configCache = await res.json();
  return configCache!;
}

let scriptLoading: Promise<void> | null = null;

export async function loadSquareJs(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.Square) return;
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://web.squarecdn.com/v1/square.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Square.js"));
    document.head.appendChild(script);
  });

  return scriptLoading;
}

export async function initSquarePayments(apiBase: string): Promise<SquarePayments> {
  const [config] = await Promise.all([getSquareConfig(apiBase), loadSquareJs()]);
  if (!window.Square) throw new Error("Square.js did not initialize.");
  return window.Square.payments(config.squareApplicationId, config.squareLocationId);
}
