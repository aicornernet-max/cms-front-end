import { useMutation } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import type { CreateSeoPageV2Payload } from "../types/seoPageV2.types";

export function useCreateSeoPageV2() {
  return useMutation({
    mutationFn: (payload: CreateSeoPageV2Payload) =>
      seoPageV2Api.createPage(payload),
  });
}
