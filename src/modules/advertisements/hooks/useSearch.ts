import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import advertisementService from "../services/advertisement.service";

const useDebouncedValue = (value: string, delayMs = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
};

export const useToolSearch = (query: string) => {
  const debouncedQuery = useDebouncedValue(query);

  return useQuery({
    queryKey: ["tools", "search", debouncedQuery],
    queryFn: () => advertisementService.searchTools(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
  });
};

// export const useBookingSearch = (query: string) => {
//   const debouncedQuery = useDebouncedValue(query);

//   return useQuery({
//     queryKey: ["bookings", "search", debouncedQuery],
//     queryFn: () => advertisementService.searchBookings(debouncedQuery),
//     enabled: debouncedQuery.trim().length >= 2,
//   });
// };
