import axiosInstance from "../../../api/axios";
import type { CategoriesApiResponse } from "../types";

export const getPublicCategories = async (): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get<CategoriesApiResponse>(
    "/public/categories",
  );

  return response.data;
};
