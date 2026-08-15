import { useQuery } from "@tanstack/react-query";
import { getPublicCategories } from "../services/publicCategory.service";

export const useCategories = () =>
  useQuery({
    queryKey: ["seo-pages", "categories"],
    queryFn: getPublicCategories,
    staleTime: 5 * 60 * 1000,
  });
