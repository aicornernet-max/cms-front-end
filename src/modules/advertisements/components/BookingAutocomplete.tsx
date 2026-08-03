import { useState } from "react";
// import { useBookingSearch } from "../hooks/useSearch";
import type { BookingSearchResult } from "../types/advertisement.types";
import { formatDate } from "../utils/advertisement.utils";

interface BookingAutocompleteProps {
  value: BookingSearchResult | null;
  onChange: (booking: BookingSearchResult) => void;
  error?: string;
}

const BookingAutocomplete = ({
  value,
  // onChange,
  error,
}: BookingAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const { data: results, isFetching } = useBookingSearch(query);

  // const handleSelect = (booking: BookingSearchResult) => {
  //   onChange(booking);
  //   setQuery("");
  //   setIsOpen(false);
  // };

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Booking
      </label>

      {value && !isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full flex-col items-start rounded-md border border-gray-300 px-3 py-2 text-left text-sm hover:border-indigo-400"
        >
          <span className="font-medium text-gray-900">
            {value.bookingNumber}
          </span>
          <span className="text-xs text-gray-500">
            {value.vendorName} &middot; {formatDate(value.startDate)} -{" "}
            {formatDate(value.endDate)}
          </span>
        </button>
      ) : (
        <input
          type="text"
          value={query}
          autoFocus={isOpen}
          placeholder="Search bookings by number or vendor..."
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          }`}
        />
      )}

      {/* {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {isFetching && (
            <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
          )}
          {!isFetching && results?.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No bookings found
            </div>
          )}
          {!isFetching &&
            results?.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => handleSelect(booking)}
                className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {booking.bookingNumber}
                </span>
                <span className="text-xs text-gray-500">
                  {booking.vendorName} &middot; {formatDate(booking.startDate)}{" "}
                  - {formatDate(booking.endDate)}
                </span>
              </button>
            ))}
        </div>
      )} */}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default BookingAutocomplete;
