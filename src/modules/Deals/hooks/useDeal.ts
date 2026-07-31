import { useQuery } from "@tanstack/react-query";
import { dealsApi } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";

export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: dealsKeys.detail(id ?? ""),
    queryFn: () => dealsApi.getById(id as string),
    enabled: !!id,
  });
}
