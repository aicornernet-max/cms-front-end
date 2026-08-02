import { useNavigate } from "react-router-dom";
import { BookingForm } from "../components/BookingForm";
import { useCreateBooking } from "../hooks/useCreateBooking";
import type { CreateBookingFormValues } from "../validations/booking.validation";

export default function BookingCreatePage() {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();

  const handleSubmit = (values: CreateBookingFormValues) => {
    createBooking.mutate(values, {
      onSuccess: (booking) => navigate(`/bookings/${booking._id}`),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">New booking</h1>
        <p className="text-sm text-gray-500">
          Availability is always verified by the backend before the booking is created.
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-5">
        <BookingForm
          mode="create"
          isSubmitting={createBooking.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/bookings")}
        />
      </div>
    </div>
  );
}
