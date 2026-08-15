import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2Keys } from "../lib/queryKeys";
import type { UpdateFaqsPayload } from "../types/seoPageV2.types";

export function useSaveSeoPageFaqs(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFaqsPayload) => {
      if (!id) throw new Error("Missing page id");
      return seoPageV2Api.updateFaqs(id, payload);
    },
    onSuccess: (updated) => {
      if (id) {
        queryClient.setQueryData(seoPageV2Keys.detail(id), updated);
      }
    },
  });
}
