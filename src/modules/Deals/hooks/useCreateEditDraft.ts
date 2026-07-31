import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";

export function useCreateEditDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (publishedId: string) => dealsApi.createEditDraft(publishedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}
