import { useQuery } from "@tanstack/react-query";
import { dealsApi, type DealsListParams } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";

export function useDealsList(params: DealsListParams) {
  return useQuery({
    queryKey: dealsKeys.list(params),
    queryFn: () => dealsApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}
