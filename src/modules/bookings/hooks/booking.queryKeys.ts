import type { BookingListFilters } from "../types/booking.types";

/**
 * Centralized query key factory so list/detail invalidation stays
 * consistent across every hook in this module.
 */
export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (filters: Omit<BookingListFilters, "search">) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};
