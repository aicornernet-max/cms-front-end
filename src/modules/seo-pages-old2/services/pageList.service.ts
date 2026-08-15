import axiosInstance from "../../../api/axios";
import type { PageQueryParams, PagesApiResponse } from "../types";

const buildParams = (params: PageQueryParams) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));

  if (params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.categoryId) {
    searchParams.set("categoryId", params.categoryId);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.toolsCount) {
    searchParams.set("toolsCount", params.toolsCount);
  }

  return searchParams;
};

export const getPages = async (
  params: PageQueryParams,
): Promise<PagesApiResponse> => {
  const response = await axiosInstance.get<PagesApiResponse>("/pages", {
    params: buildParams(params),
  });

  return response.data;
};
