/**
 * Plain async fetch functions extracted from the orval-generated api.ts.
 * This file intentionally has NO @tanstack/react-query imports so it can be
 * tree-shaken cleanly. Hooks live in api.ts; import from there when you need them.
 */
import type {
  BookingRequestInput,
  BookingRequestListResponse,
  BookingRequestResult,
  ErrorEnvelope,
  HealthStatus,
  UploadUrlRequest,
  UploadUrlResponse,
} from './api.schemas';

import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';

// Suppress unused-type lint warnings for re-exported API types
export type { ErrorType, BodyType };

// ── Health check ──────────────────────────────────────────────────────────────

export const getHealthCheckUrl = () => `/api/healthz`;

/** @summary Health check */
export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> =>
  customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: 'GET' });

// ── Booking requests ──────────────────────────────────────────────────────────

export const getCreateBookingRequestUrl = () => `/api/booking-requests`;

/** @summary Submit a booking / contact request */
export const createBookingRequest = async (
  bookingRequestInput: BookingRequestInput,
  options?: RequestInit,
): Promise<BookingRequestResult> =>
  customFetch<BookingRequestResult>(getCreateBookingRequestUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(bookingRequestInput),
  });

export const getListBookingRequestsUrl = () => `/api/booking-requests`;

/** @summary List submitted booking / contact / careers requests */
export const listBookingRequests = async (
  options?: RequestInit,
): Promise<BookingRequestListResponse> =>
  customFetch<BookingRequestListResponse>(getListBookingRequestsUrl(), {
    ...options,
    method: 'GET',
  });

// Re-export types consumed by callers
export type { BookingRequestInput, BookingRequestListResponse, BookingRequestResult };

// ── Staff analytics ───────────────────────────────────────────────────────────

export interface StaffAnalyticsResponse {
  sinceDate: string;
  days: number;
  totalsByPath: { path: string; totalViews: number }[];
  dailyRows: { path: string; viewDate: string; count: number }[];
}

export const getStaffAnalyticsUrl = (days?: number) =>
  `/api/staff/analytics${days ? `?days=${days}` : ''}`;

/** @summary Clerk-protected page-view analytics for the staff dashboard */
export const getStaffAnalytics = async (
  days?: number,
  options?: RequestInit,
): Promise<StaffAnalyticsResponse> =>
  customFetch<StaffAnalyticsResponse>(getStaffAnalyticsUrl(days), {
    ...options,
    method: 'GET',
  });

// ── Storage: presigned upload URL ─────────────────────────────────────────────

export const getRequestUploadUrlUrl = () => `/api/storage/uploads/request-url`;

/** @summary Request a presigned URL for file upload */
export const requestUploadUrl = async (
  uploadUrlRequest: UploadUrlRequest,
  options?: RequestInit,
): Promise<UploadUrlResponse> =>
  customFetch<UploadUrlResponse>(getRequestUploadUrlUrl(), {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(uploadUrlRequest),
  });

export type { UploadUrlRequest, UploadUrlResponse };

// ── Storage: public object ────────────────────────────────────────────────────

export const getGetPublicObjectUrl = (filePath: string) =>
  `/api/storage/public-objects/${filePath}`;

/** @summary Serve a public asset from PUBLIC_OBJECT_SEARCH_PATHS */
export const getPublicObject = async (filePath: string, options?: RequestInit): Promise<Blob> =>
  customFetch<Blob>(getGetPublicObjectUrl(filePath), { ...options, method: 'GET' });

// ── Storage: private object ───────────────────────────────────────────────────

export const getGetStorageObjectUrl = (objectPath: string) =>
  `/api/storage/objects/${objectPath}`;

/** @summary Serve an object entity from PRIVATE_OBJECT_DIR */
export const getStorageObject = async (
  objectPath: string,
  options?: RequestInit,
): Promise<Blob> =>
  customFetch<Blob>(getGetStorageObjectUrl(objectPath), { ...options, method: 'GET' });

export type { HealthStatus, ErrorEnvelope };
