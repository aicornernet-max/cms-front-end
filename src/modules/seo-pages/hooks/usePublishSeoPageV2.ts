import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2Keys } from "../lib/queryKeys";
import type { SeoPageV2Status } from "../types/seoPageV2.types";

export function usePublishSeoPageV2(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: SeoPageV2Status) => {
      if (!id) throw new Error("Missing page id");
      return seoPageV2Api.updateStatus(id, { status });
    },
    onSuccess: (updated) => {
      if (id) {
        queryClient.setQueryData(seoPageV2Keys.detail(id), updated);
      }
    },
  });
}
