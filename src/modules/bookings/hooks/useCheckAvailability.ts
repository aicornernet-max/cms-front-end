import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookingService } from "../services/booking.service";
import { extractErrorMessage } from "../utils/booking.utils";

/**
 * Availability is always computed by the backend (see /check-availability).
 * This is a mutation, not a query, because it's an explicit on-demand action
 * ("Check availability" button) with side-effect-free, one-shot semantics —
 * not data to keep cached/refetched in the background.
 */
export function useCheckAvailability() {
  return useMutation({
    mutationFn: bookingService.checkAvailability,
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, "Could not check availability"));
    },
  });
}

/** Directly fetches suggested slots, e.g. for a "show me more options" action. */
export function useSuggestSlots() {
  return useMutation({
    mutationFn: bookingService.suggestSlots,
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, "Could not fetch suggested slots"));
    },
  });
}
