import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookingService } from "../services/booking.service";
import { extractErrorMessage } from "../utils/booking.utils";
import { bookingKeys } from "./booking.queryKeys";

/**
 * ASSUMPTION: the backend booking module exposes no hard-delete endpoint —
 * only PATCH /:id/cancel (see booking.routes.js). "Deleting" a booking from
 * this admin UI therefore means cancelling it; the record itself is never
 * removed. If a real DELETE endpoint is added later, only `mutationFn` here
 * needs to change.
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
      toast.success("Booking cancelled");
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, "Could not cancel booking"));
    },
  });
}
