import { useMutation } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";

export function useCreateOrGetDraft() {
  return useMutation({
    mutationFn: (publishedId: string) =>
      seoPageV2Api.createOrGetDraft(publishedId),
  });
}
