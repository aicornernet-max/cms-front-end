import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi, type CreateDraftPayload } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";

export function useCreateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDraftPayload) => dealsApi.createDraft(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}
