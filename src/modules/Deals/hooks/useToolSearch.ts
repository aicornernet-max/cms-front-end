import { useQuery } from "@tanstack/react-query";
import { dealsApi } from "../services/deals.api";
import { toolsKeys } from "../lib/queryKeys";
import { useDebouncedValue } from "../lib/useDebouncedValue";

export function useToolSearch(rawQuery: string) {
  const query = useDebouncedValue(rawQuery.trim(), 300);

  return useQuery({
    queryKey: toolsKeys.search(query),
    queryFn: () => dealsApi.searchTools(query),
    enabled: query.length > 0,
  });
}
