import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";
import type { Booking, BookingListFilters, BookingListResponse } from "../types/booking.types";
import { bookingKeys } from "./booking.queryKeys";

/**
 * Lists bookings for the current filter/pagination state.
 *
 * `search` has no backend endpoint (see booking.service.ts), so it's applied
 * client-side against the current page's client name only — it is a
 * convenience quick-filter, not a substitute for a real backend search.
 */
export function useBookings(filters: BookingListFilters) {
  const { search, ...serverFilters } = filters;

  const query = useQuery<BookingListResponse>({
    queryKey: bookingKeys.list(serverFilters),
    queryFn: () => bookingService.listBookings(serverFilters),
    placeholderData: keepPreviousData,
  });

  const filteredItems: Booking[] = search
    ? (query.data?.items ?? []).filter((booking) =>
        (booking.clientName ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : (query.data?.items ?? []);

  return {
    ...query,
    items: filteredItems,
    pagination: query.data?.pagination,
  };
}
