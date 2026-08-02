import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookingService } from "../services/booking.service";
import type { Booking } from "../types/booking.types";
import { extractErrorMessage } from "../utils/booking.utils";
import { bookingKeys } from "./booking.queryKeys";

/**
 * Bundles the three lifecycle-transition actions for one booking. The
 * backend alone decides which transitions are legal (BOOKING_STATUS_TRANSITIONS
 * in booking.constants.js) — this hook does not replicate that logic, it
 * only wires up the calls and cache updates. UI code should still only
 * *render* the actions that are valid for the booking's current status (see
 * StatusActionButtons.tsx), so users aren't invited to try an action the
 * backend is guaranteed to reject.
 */
export function useBookingStatus(id: string) {
  const queryClient = useQueryClient();

  const onSuccess = (updated: Booking, message: string) => {
    queryClient.setQueryData(bookingKeys.detail(id), updated);
    queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    toast.success(message);
  };

  const onError = (fallback: string) => (error: unknown) => {
    toast.error(extractErrorMessage(error, fallback));
  };

  const confirm = useMutation({
    mutationFn: () => bookingService.confirmBooking(id),
    onSuccess: (updated) => onSuccess(updated, "Booking confirmed"),
    onError: onError("Could not confirm booking"),
  });

  const cancel = useMutation({
    mutationFn: () => bookingService.cancelBooking(id),
    onSuccess: (updated) => onSuccess(updated, "Booking cancelled"),
    onError: onError("Could not cancel booking"),
  });

  const complete = useMutation({
    mutationFn: () => bookingService.completeBooking(id),
    onSuccess: (updated) => onSuccess(updated, "Booking completed"),
    onError: onError("Could not complete booking"),
  });

  return { confirm, cancel, complete };
}
