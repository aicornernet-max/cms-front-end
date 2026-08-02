/**
 * Types mirror the backend Booking module's API contract exactly.
 * See booking.service.ts for the endpoints these shapes correspond to.
 */

export const BOOKING_STATUS = {
  DRAFT: "DRAFT",
  AVAILABILITY_RESERVED: "AVAILABILITY_RESERVED",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export interface Booking {
  _id: string;
  vendorId: string;
  clientId: string | null;
  clientName?: string;
  clientTimezone: string;
  localStartDate: string; // "YYYY-MM-DD"
  localStartTime: string; // "HH:mm"
  durationHours: number;
  startUtc: string; // ISO
  endUtc: string; // ISO
  status: BookingStatus;
  notes?: string;
  localStart?: string; // ISO, computed by backend for display
  localEnd?: string; // ISO, computed by backend for display
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedSlot {
  localStartDate: string;
  localStartTime: string;
  localEndDate: string;
  localEndTime: string;
  startUtc: string;
  endUtc: string;
  durationHours: number;
}

export interface CheckAvailabilityPayload {
  vendorId: string;
  timezone: string;
  date: string;
  time: string;
  duration: number;
  excludeBookingId?: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  startUtc?: string;
  endUtc?: string;
  conflicts?: Array<{ id: string; startUtc: string; endUtc: string; status: BookingStatus }>;
  suggestedSlots?: SuggestedSlot[];
}

export interface SuggestSlotsPayload {
  vendorId: string;
  timezone: string;
  date: string;
  time: string;
  duration: number;
}

export interface CreateBookingPayload {
  vendorId: string;
  clientId?: string | null;
  clientName?: string;
  clientTimezone: string;
  localStartDate: string;
  localStartTime: string;
  durationHours: number;
  notes?: string;
}

export type UpdateBookingPayload = Partial<
  Pick<
    CreateBookingPayload,
    "clientId" | "clientName" | "clientTimezone" | "localStartDate" | "localStartTime" | "durationHours" | "notes"
  >
>;

export interface BookingListFilters {
  vendor?: string;
  status?: BookingStatus;
  date?: string;
  month?: string; // "YYYY-MM"
  search?: string; // client-side-only convenience filter, not sent to a backend endpoint unless one exists
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BookingListResponse {
  items: Booking[];
  pagination: Pagination;
}

/** Shape returned by the shared API response wrapper (successResponse on the backend). */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
