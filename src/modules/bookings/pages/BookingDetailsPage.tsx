import { Link, useParams } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import { StatusBadge } from "../components/StatusBadge";
import { BookingTimeline } from "../components/BookingTimeline";
import { StatusActionButtons } from "../components/StatusActionButtons";
import { ErrorState } from "../components/BookingStates";
import { formatDateTime, formatDuration, extractErrorMessage } from "../utils/booking.utils";

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading, isError, error, refetch } = useBooking(id);

  if (isLoading) {
    return <div className="animate-pulse text-sm text-gray-500">Loading booking…</div>;
  }

  if (isError || !booking) {
    return (
      <ErrorState message={extractErrorMessage(error, "Could not load this booking.")} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/bookings" className="text-sm text-gray-500 hover:underline">
            ← Back to bookings
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Booking details</h1>
            <StatusBadge status={booking.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/bookings/${booking._id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <BookingTimeline status={booking.status} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-3 text-xs font-medium text-gray-500">Actions</p>
        <StatusActionButtons bookingId={booking._id} status={booking.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailField label="Vendor ID" value={booking.vendorId} />
        <DetailField label="Client name" value={booking.clientName || "—"} />
        <DetailField label="Client timezone" value={booking.clientTimezone} />
        <DetailField label="Duration" value={formatDuration(booking.durationHours)} />
        <DetailField
          label="Local time"
          value={`${booking.localStartDate} ${booking.localStartTime} (${booking.clientTimezone})`}
        />
        <DetailField label="UTC time" value={`${formatDateTime(booking.startUtc)} → ${formatDateTime(booking.endUtc)}`} />
        <DetailField label="Created" value={formatDateTime(booking.createdAt)} />
        <DetailField label="Last updated" value={formatDateTime(booking.updatedAt)} />
      </div>

      {booking.notes && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{booking.notes}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-3 text-xs font-medium text-gray-500">Actions</p>
        <StatusActionButtons bookingId={booking._id} status={booking.status} />
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value}</p>
    </div>
  );
}
