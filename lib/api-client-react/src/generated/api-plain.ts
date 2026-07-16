/**
 * Plain async fetch functions — no @tanstack/react-query imports, safe to
 * import anywhere (including 'use client' components on static-export pages).
 * React Query hooks live in api.ts; import from there when you need them.
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

export type { ErrorType, BodyType };

// ── Health check ──────────────────────────────────────────────────────────────

export const getHealthCheckUrl = () => `/api/healthz`;

export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> =>
  customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: 'GET' });

// ── Booking requests ──────────────────────────────────────────────────────────

export const getCreateBookingRequestUrl = () => `/api/booking-requests`;

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

export const listBookingRequests = async (
  options?: RequestInit,
): Promise<BookingRequestListResponse> =>
  customFetch<BookingRequestListResponse>(getListBookingRequestsUrl(), {
    ...options,
    method: 'GET',
  });

export type { BookingRequestInput, BookingRequestListResponse, BookingRequestResult };

// ── Job listings (public) ─────────────────────────────────────────────────────

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string | null;
  salaryRange: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobListingsResponse {
  listings: JobListing[];
}

export interface CreateJobListingInput {
  title: string;
  department: string;
  location?: string;
  type?: string;
  description: string;
  requirements?: string;
  salaryRange?: string;
  isActive?: boolean;
}

export type UpdateJobListingInput = Partial<CreateJobListingInput>;

export const getJobListingsUrl = () => `/api/job-listings`;

/** Public — returns only active listings. */
export const getJobListings = async (options?: RequestInit): Promise<JobListingsResponse> =>
  customFetch<JobListingsResponse>(getJobListingsUrl(), { ...options, method: 'GET' });

export const getStaffJobListingsUrl = () => `/api/staff/job-listings`;

/** Staff-auth — returns all listings including inactive. */
export const getStaffJobListings = async (
  options?: RequestInit,
): Promise<JobListingsResponse> =>
  customFetch<JobListingsResponse>(getStaffJobListingsUrl(), { ...options, method: 'GET' });

export const createJobListing = async (
  input: CreateJobListingInput,
  options?: RequestInit,
): Promise<{ listing: JobListing }> =>
  customFetch<{ listing: JobListing }>('/api/staff/job-listings', {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(input),
  });

export const updateJobListing = async (
  id: string,
  input: UpdateJobListingInput,
  options?: RequestInit,
): Promise<{ listing: JobListing }> =>
  customFetch<{ listing: JobListing }>(`/api/staff/job-listings/${id}`, {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(input),
  });

export const deleteJobListing = async (
  id: string,
  options?: RequestInit,
): Promise<{ ok: boolean }> =>
  customFetch<{ ok: boolean }>(`/api/staff/job-listings/${id}`, {
    ...options,
    method: 'DELETE',
  });

// ── Staff analytics ───────────────────────────────────────────────────────────

export interface StaffAnalyticsResponse {
  sinceDate: string;
  days: number;
  totalsByPath: { path: string; totalViews: number }[];
  dailyRows: { path: string; viewDate: string; count: number }[];
}

export const getStaffAnalyticsUrl = (days?: number) =>
  `/api/staff/analytics${days ? `?days=${days}` : ''}`;

export const getStaffAnalytics = async (
  days?: number,
  options?: RequestInit,
): Promise<StaffAnalyticsResponse> =>
  customFetch<StaffAnalyticsResponse>(getStaffAnalyticsUrl(days), {
    ...options,
    method: 'GET',
  });

// ── Storage ───────────────────────────────────────────────────────────────────

export const getRequestUploadUrlUrl = () => `/api/storage/uploads/request-url`;

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

export const getGetPublicObjectUrl = (filePath: string) =>
  `/api/storage/public-objects/${filePath}`;

export const getPublicObject = async (filePath: string, options?: RequestInit): Promise<Blob> =>
  customFetch<Blob>(getGetPublicObjectUrl(filePath), { ...options, method: 'GET' });

export const getGetStorageObjectUrl = (objectPath: string) =>
  `/api/storage/objects/${objectPath}`;

export const getStorageObject = async (
  objectPath: string,
  options?: RequestInit,
): Promise<Blob> =>
  customFetch<Blob>(getGetStorageObjectUrl(objectPath), { ...options, method: 'GET' });

export type { HealthStatus, ErrorEnvelope };
