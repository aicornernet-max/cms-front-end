import { ChangeEvent } from "react";
import type { AdvertisementListParams } from "../types/advertisement.types";
import { STATUS_OPTIONS } from "../utils/advertisement.utils";

interface AdvertisementFiltersProps {
  filters: AdvertisementListParams;
  onChange: (next: AdvertisementListParams) => void;
}

const AdvertisementFilters = ({
  filters,
  onChange,
}: AdvertisementFiltersProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      status: e.target.value as AdvertisementListParams["status"],
      page: 1,
    });
  };

  const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, vendorId: e.target.value, page: 1 });
  };

  const handleBookingChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, bookingId: e.target.value, page: 1 });
  };

  const handleReset = () => {
    onChange({ page: 1, limit: filters.limit });
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600" htmlFor="ad-search">
          Search
        </label>
        <input
          id="ad-search"
          type="text"
          placeholder="Search by title..."
          value={filters.search ?? ""}
          onChange={handleSearchChange}
          className="w-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600" htmlFor="ad-status">
          Status
        </label>
        <select
          id="ad-status"
          value={filters.status ?? ""}
          onChange={handleStatusChange}
          className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600" htmlFor="ad-vendor">
          Vendor ID
        </label>
        <input
          id="ad-vendor"
          type="text"
          placeholder="Filter by vendor..."
          value={filters.vendorId ?? ""}
          onChange={handleVendorChange}
          className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600" htmlFor="ad-booking">
          Booking ID
        </label>
        <input
          id="ad-booking"
          type="text"
          placeholder="Filter by booking..."
          value={filters.bookingId ?? ""}
          onChange={handleBookingChange}
          className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        Clear filters
      </button>
    </div>
  );
};

export default AdvertisementFilters;
