import { useQuery } from "@tanstack/react-query";
import { getPages } from "../services/pageList.service";
import type { PageQueryParams } from "../types";

export const usePages = (params: PageQueryParams) =>
  useQuery({
    queryKey: ["seo-pages", "list", params],
    queryFn: () => getPages(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
