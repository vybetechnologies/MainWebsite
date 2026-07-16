// Plain async fetch functions — no React Query dependency, safe to import anywhere.
export * from "./generated/api-plain";
export * from "./generated/api.schemas";
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";

// React Query hooks — only import these inside components wrapped in QueryClientProvider.
// export * from "./generated/api";
