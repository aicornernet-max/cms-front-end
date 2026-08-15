import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2Keys, seoPageV2ToolSearchKeys } from "../lib/queryKeys";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import type { UpdateToolsPayload } from "../types/seoPageV2.types";

export function useToolSearch(rawQuery: string) {
  const query = useDebouncedValue(rawQuery.trim(), 300);

  return useQuery({
    queryKey: seoPageV2ToolSearchKeys.search(query),
    queryFn: () => seoPageV2Api.searchTools(query),
    enabled: query.length > 0,
  });
}

export function useSaveSeoPageTools(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateToolsPayload) => {
      if (!id) throw new Error("Missing page id");
      return seoPageV2Api.updateTools(id, payload);
    },
    onSuccess: (updated) => {
      if (id) {
        queryClient.setQueryData(seoPageV2Keys.detail(id), updated);
      }
    },
  });
}
