import { BOOKING_STATUS, type BookingStatus } from "../types/booking.types";

/**
 * Display metadata for each status. The *set* of statuses and which
 * transitions are legal is entirely backend-owned (see BOOKING_STATUS_TRANSITIONS
 * in booking.constants.js) — this map only controls how a known status
 * looks in the UI, it never decides what's allowed.
 */
export const STATUS_DISPLAY: Record<BookingStatus, { label: string; badgeClassName: string }> = {
  DRAFT: { label: "Draft", badgeClassName: "bg-gray-100 text-gray-700" },
  AVAILABILITY_RESERVED: { label: "Reserved", badgeClassName: "bg-amber-100 text-amber-800" },
  PAYMENT_PENDING: { label: "Payment pending", badgeClassName: "bg-amber-100 text-amber-800" },
  PAYMENT_SUCCESS: { label: "Payment received", badgeClassName: "bg-blue-100 text-blue-800" },
  CONFIRMED: { label: "Confirmed", badgeClassName: "bg-emerald-100 text-emerald-800" },
  COMPLETED: { label: "Completed", badgeClassName: "bg-slate-200 text-slate-700" },
  CANCELLED: { label: "Cancelled", badgeClassName: "bg-red-100 text-red-700" },
};

export const BOOKING_STATUS_OPTIONS: Array<{ value: BookingStatus; label: string }> = Object.values(
  BOOKING_STATUS
).map((status) => ({ value: status, label: STATUS_DISPLAY[status].label }));

/**
 * Timeline stage order for the visual stepper. Mirrors the backend's happy
 * path (booking.constants.js `BOOKING_STATUS_TRANSITIONS`). CANCELLED is
 * handled separately since it can be reached from most other stages rather
 * than being a fixed step in the sequence.
 */
export const TIMELINE_STAGES: BookingStatus[] = [
  BOOKING_STATUS.DRAFT,
  BOOKING_STATUS.AVAILABILITY_RESERVED,
  BOOKING_STATUS.PAYMENT_PENDING,
  BOOKING_STATUS.PAYMENT_SUCCESS,
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.COMPLETED,
];

/** Formats an ISO datetime string for display, e.g. "5 Aug 2026, 14:00". */
export function formatDateTime(iso: string | undefined): string {
  if (!iso) return "—";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

/** Formats a duration in hours as a readable string, e.g. "48h (2 days)". */
export function formatDuration(durationHours: number): string {
  if (durationHours % 24 === 0 && durationHours >= 24) {
    const days = durationHours / 24;
    return `${durationHours}h (${days} day${days > 1 ? "s" : ""})`;
  }
  return `${durationHours}h`;
}

/**
 * A representative list of IANA timezones for the picker. Swap for the
 * project's existing timezone list/component if one already exists
 * elsewhere in the dashboard.
 */
export const COMMON_TIMEZONES: string[] = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

/** Builds an accessible label for an ObjectId-only vendor/client until richer entities are wired in. */
export function shortId(id: string | null | undefined): string {
  if (!id) return "—";
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

/**
 * Reads the backend's standard error shape (see errorResponse in the
 * project's responseHandler) off an axios error, without importing axios's
 * error type directly — just the common `response.data.message` shape.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
