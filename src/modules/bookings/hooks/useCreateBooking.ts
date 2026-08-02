import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookingService } from "../services/booking.service";
import type { CreateBookingPayload } from "../types/booking.types";
import { extractErrorMessage } from "../utils/booking.utils";
import { bookingKeys } from "./booking.queryKeys";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast.success("Booking created");
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, "Could not create booking"));
    },
  });
}
