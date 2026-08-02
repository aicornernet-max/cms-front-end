import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";
import { bookingKeys } from "./booking.queryKeys";

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(id ?? ""),
    queryFn: () => bookingService.getBooking(id as string),
    enabled: Boolean(id),
  });
}
