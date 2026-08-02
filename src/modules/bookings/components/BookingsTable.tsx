import { Link } from "react-router-dom";
import type { Booking } from "../types/booking.types";
import { formatDateTime, formatDuration, shortId } from "../utils/booking.utils";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, TableSkeleton } from "./BookingStates";

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
}

const COLUMNS = [
  "Vendor",
  "Client",
  "Timezone",
  "Local start",
  "Duration",
  "Status",
  "Created",
];

export function BookingsTable({ bookings, isLoading }: BookingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500">
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {isLoading ? (
          <TableSkeleton columns={COLUMNS.length} />
        ) : (
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/bookings/${booking._id}`} className="font-medium text-gray-900 hover:underline">
                    {shortId(booking.vendorId)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{booking.clientName || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{booking.clientTimezone}</td>
                <td className="px-4 py-3 text-gray-700">
                  {booking.localStartDate} · {booking.localStartTime}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDuration(booking.durationHours)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDateTime(booking.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {!isLoading && bookings.length === 0 && <EmptyState />}
    </div>
  );
}
