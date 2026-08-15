import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category.service";

export const useCategories = () =>
  useQuery({
    queryKey: ["seo-pages", "categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
