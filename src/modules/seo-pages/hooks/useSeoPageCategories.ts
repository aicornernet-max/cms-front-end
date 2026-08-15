import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../shared/services/category.service";
import { seoPageV2CategoryKeys } from "../lib/queryKeys";
import type { SeoPageV2Category } from "../types/seoPageV2.types";

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: SeoPageV2Category[];
}

export function useSeoPageCategories() {
  return useQuery({
    queryKey: seoPageV2CategoryKeys.all,
    queryFn: async () => {
      const response = await getCategories();
      return (response.data as CategoriesResponse).data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
