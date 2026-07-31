import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";

export function useAutoSaveDraft(draftId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!draftId) throw new Error("Missing draft id");
      return dealsApi.updateDraft(draftId, formData);
    },
    onSuccess: (updated) => {
      if (draftId) {
        queryClient.setQueryData(dealsKeys.detail(draftId), updated);
      }
    },
  });
}
