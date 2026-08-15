import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2Keys } from "../lib/queryKeys";

export function useDeleteSeoPageDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => seoPageV2Api.deletePage(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: seoPageV2Keys.detail(id) });
    },
  });
}
