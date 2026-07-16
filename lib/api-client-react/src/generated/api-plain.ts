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

export const getJobListings = async (options?: RequestInit): Promise<JobListingsResponse> =>
  customFetch<JobListingsResponse>('/api/job-listings', { ...options, method: 'GET' });

export const getStaffJobListings = async (options?: RequestInit): Promise<JobListingsResponse> =>
  customFetch<JobListingsResponse>('/api/staff/job-listings', { ...options, method: 'GET' });

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

// ── Job applications ──────────────────────────────────────────────────────────

export const APPLICATION_STATUSES = [
  'new',
  'reviewing',
  'interview',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface JobApplication {
  id: string;
  jobListingId: string;
  jobListingTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  coverLetter: string;
  resumeObjectPath: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  availability: string | null;
  status: ApplicationStatus;
  staffNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitApplicationInput {
  jobListingId: string;
  jobListingTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeObjectPath?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  availability?: string;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
  staffNotes?: string;
}

export interface ApplicationsResponse {
  applications: JobApplication[];
}

export const submitApplication = async (
  input: SubmitApplicationInput,
  options?: RequestInit,
): Promise<{ application: JobApplication }> =>
  customFetch<{ application: JobApplication }>('/api/applications', {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(input),
  });

export const getStaffApplications = async (
  filters?: { jobId?: string; status?: ApplicationStatus },
  options?: RequestInit,
): Promise<ApplicationsResponse> => {
  const params = new URLSearchParams();
  if (filters?.jobId) params.set('jobId', filters.jobId);
  if (filters?.status) params.set('status', filters.status);
  const qs = params.toString();
  return customFetch<ApplicationsResponse>(
    `/api/staff/applications${qs ? `?${qs}` : ''}`,
    { ...options, method: 'GET' },
  );
};

export const updateApplication = async (
  id: string,
  input: UpdateApplicationInput,
  options?: RequestInit,
): Promise<{ application: JobApplication }> =>
  customFetch<{ application: JobApplication }>(`/api/staff/applications/${id}`, {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(input),
  });

// ── Staff analytics ───────────────────────────────────────────────────────────

export interface StaffAnalyticsResponse {
  sinceDate: string;
  days: number;
  totalsByPath: { path: string; totalViews: number }[];
  dailyRows: { path: string; viewDate: string; count: number }[];
}

export const getStaffAnalytics = async (
  days?: number,
  options?: RequestInit,
): Promise<StaffAnalyticsResponse> =>
  customFetch<StaffAnalyticsResponse>(
    `/api/staff/analytics${days ? `?days=${days}` : ''}`,
    { ...options, method: 'GET' },
  );

// ── Storage ───────────────────────────────────────────────────────────────────

export const requestUploadUrl = async (
  uploadUrlRequest: UploadUrlRequest,
  options?: RequestInit,
): Promise<UploadUrlResponse> =>
  customFetch<UploadUrlResponse>('/api/storage/uploads/request-url', {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(uploadUrlRequest),
  });

export type { UploadUrlRequest, UploadUrlResponse };

export const getPublicObject = async (filePath: string, options?: RequestInit): Promise<Blob> =>
  customFetch<Blob>(`/api/storage/public-objects/${filePath}`, { ...options, method: 'GET' });

export const getStorageObject = async (
  objectPath: string,
  options?: RequestInit,
): Promise<Blob> =>
  customFetch<Blob>(`/api/storage/objects/${objectPath}`, { ...options, method: 'GET' });

export type { HealthStatus, ErrorEnvelope };
