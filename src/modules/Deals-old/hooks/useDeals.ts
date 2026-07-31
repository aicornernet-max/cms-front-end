import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dealsApi } from "../api/dealsApi";
import type { DealsFilterState } from "../types";

interface UseDealsArgs {
  page: number;
  limit: number;
  search: string;
  filters: DealsFilterState;
}

/**
 * search/filters are accepted here (and included in the query key with a
 * comment) so that turning on server-side search/filtering later is a
 * one-line change in dealsApi.getDeals, not a hook rewrite.
 */
export function useDeals({ page, limit, search, filters }: UseDealsArgs) {
  return useQuery({
    // NOTE: search/filters intentionally left out of the key for now since
    // they aren't sent to the server yet — add them back in when wired up:
    // queryKey: ["deals", page, limit, search, filters],
    queryKey: ["deals", page, limit],
    queryFn: () => dealsApi.getDeals({ page, limit, search, filters }),
    placeholderData: keepPreviousData,
  });
}
