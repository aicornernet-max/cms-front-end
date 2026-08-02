import { useState } from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import type { BookingListFilters } from "../types/booking.types";
import { BookingFilters } from "../components/BookingFilters";
import { BookingsTable } from "../components/BookingsTable";
import { Pagination } from "../components/Pagination";
import { ErrorState } from "../components/BookingStates";
import { extractErrorMessage } from "../utils/booking.utils";

const DEFAULT_FILTERS: BookingListFilters = { page: 1, limit: 20 };

export default function BookingListPage() {
  const [filters, setFilters] = useState<BookingListFilters>(DEFAULT_FILTERS);
  const { items, pagination, isLoading, isFetching, isError, error, refetch } = useBookings(filters);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500">Manage advertisement slot bookings across vendors.</p>
        </div>
        <Link
          to="/bookings/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New booking
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <BookingFilters
          filters={filters}
          onChange={setFilters}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        {isError ? (
          <ErrorState message={extractErrorMessage(error, "Could not load bookings.")} onRetry={() => refetch()} />
        ) : (
          <>
            <BookingsTable bookings={items} isLoading={isLoading} />
            {pagination && (
              <Pagination pagination={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
