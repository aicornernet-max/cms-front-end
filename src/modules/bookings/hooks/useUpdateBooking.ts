import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookingService } from "../services/booking.service";
import type { UpdateBookingPayload } from "../types/booking.types";
import { extractErrorMessage } from "../utils/booking.utils";
import { bookingKeys } from "./booking.queryKeys";

export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBookingPayload) => bookingService.updateBooking(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(bookingKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast.success("Booking updated");
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, "Could not update booking"));
    },
  });
}
