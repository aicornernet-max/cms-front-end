import { useQuery } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2Keys } from "../lib/queryKeys";

export function useSeoPageV2(id: string | undefined) {
  return useQuery({
    queryKey: seoPageV2Keys.detail(id ?? ""),
    queryFn: () => seoPageV2Api.getPage(id as string),
    enabled: !!id,
  });
}
