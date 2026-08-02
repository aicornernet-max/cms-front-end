import { useNavigate, useParams } from "react-router-dom";
import { BookingForm } from "../components/BookingForm";
import { useBooking } from "../hooks/useBooking";
import { useUpdateBooking } from "../hooks/useUpdateBooking";
import { ErrorState } from "../components/BookingStates";
import { extractErrorMessage } from "../utils/booking.utils";
import type { CreateBookingFormValues } from "../validations/booking.validation";

export default function BookingEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError, error, refetch } = useBooking(id);
  const updateBooking = useUpdateBooking(id ?? "");

  if (isLoading) {
    return <div className="animate-pulse text-sm text-gray-500">Loading booking…</div>;
  }

  if (isError || !booking) {
    return (
      <ErrorState message={extractErrorMessage(error, "Could not load this booking.")} onRetry={() => refetch()} />
    );
  }

  const handleSubmit = (values: CreateBookingFormValues) => {
    // vendorId is intentionally excluded — the backend's PATCH endpoint
    // never accepts it (see UpdateBookingPayload / booking.validation.js).
    const { vendorId: _vendorId, ...updatePayload } = values;
    updateBooking.mutate(updatePayload, {
      onSuccess: () => navigate(`/bookings/${booking._id}`),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Edit booking</h1>
        <p className="text-sm text-gray-500">Only fields supported by the backend's update endpoint are editable.</p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-5">
        <BookingForm
          mode="edit"
          defaultValues={{
            vendorId: booking.vendorId,
            clientId: booking.clientId ?? undefined,
            clientName: booking.clientName ?? "",
            clientTimezone: booking.clientTimezone,
            localStartDate: booking.localStartDate,
            localStartTime: booking.localStartTime,
            durationHours: booking.durationHours,
            notes: booking.notes ?? "",
          }}
          isSubmitting={updateBooking.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/bookings/${booking._id}`)}
        />
      </div>
    </div>
  );
}
