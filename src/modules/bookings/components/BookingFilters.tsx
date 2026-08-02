import type { BookingListFilters } from "../types/booking.types";
import { BOOKING_STATUS_OPTIONS } from "../utils/booking.utils";

interface BookingFiltersProps {
  filters: BookingListFilters;
  onChange: (filters: BookingListFilters) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function BookingFilters({ filters, onChange, onRefresh, isRefreshing }: BookingFiltersProps) {
  const update = (patch: Partial<BookingListFilters>) => {
    // Any filter change resets pagination back to page 1.
    onChange({ ...filters, ...patch, page: 1 });
  };

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 px-4 py-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="booking-search" className="text-xs font-medium text-gray-500">
          Search client
        </label>
        <input
          id="booking-search"
          type="text"
          placeholder="Client name"
          value={filters.search ?? ""}
          onChange={(event) => update({ search: event.target.value })}
          className="w-44 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="booking-vendor" className="text-xs font-medium text-gray-500">
          Vendor ID
        </label>
        <input
          id="booking-vendor"
          type="text"
          placeholder="Vendor id"
          value={filters.vendor ?? ""}
          onChange={(event) => update({ vendor: event.target.value || undefined })}
          className="w-44 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="booking-status" className="text-xs font-medium text-gray-500">
          Status
        </label>
        <select
          id="booking-status"
          value={filters.status ?? ""}
          onChange={(event) =>
            update({ status: (event.target.value || undefined) as BookingListFilters["status"] })
          }
          className="w-40 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          {BOOKING_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="booking-date" className="text-xs font-medium text-gray-500">
          Date
        </label>
        <input
          id="booking-date"
          type="date"
          value={filters.date ?? ""}
          onChange={(event) => update({ date: event.target.value || undefined, month: undefined })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="booking-month" className="text-xs font-medium text-gray-500">
          Month
        </label>
        <input
          id="booking-month"
          type="month"
          value={filters.month ?? ""}
          onChange={(event) => update({ month: event.target.value || undefined, date: undefined })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRefreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
