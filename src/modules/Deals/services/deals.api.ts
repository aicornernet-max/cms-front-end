import axiosInstance from "../../../api/axios";
import type {
  DealDetail,
  DealListItem,
  Pagination,
  ToolSearchResult,
  DealStatus,
} from "../types/deal.types";

export interface DealsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: DealStatus | "";
}

export interface DealsListResponse {
  deals: DealListItem[];
  pagination: Pagination;
}

export interface CreateDraftPayload {
  toolId: string;
  slug: string;
  title: string;
}

export const dealsApi = {
  list: async (params: DealsListParams): Promise<DealsListResponse> => {
    const { data } = await axiosInstance.get("/admin/deals", { params });
    return data.data;
  },

  getById: async (id: string): Promise<DealDetail> => {
    const { data } = await axiosInstance.get(`/admin/deals/${id}`);
    return data.data.deal;
  },

  createDraft: async (payload: CreateDraftPayload): Promise<DealDetail> => {
    const { data } = await axiosInstance.post("/admin/deals", payload);
    return data.data;
  },

  updateDraft: async (id: string, formData: FormData): Promise<DealDetail> => {
    const { data } = await axiosInstance.patch(
      `/admin/deals/${id}/draft`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  publish: async (id: string): Promise<DealDetail> => {
    const { data } = await axiosInstance.patch(`/admin/deals/${id}/publish`);
    return data.data;
  },

  createEditDraft: async (publishedId: string): Promise<DealDetail> => {
    const { data } = await axiosInstance.post(
      `/admin/deals/${publishedId}/edit`
    );
    return data.data;
  },

  // NOTE: no example response was provided for delete in the API doc.
  // Implemented against the conventional REST shape — adjust the verb/path
  // here if your backend differs.
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/deals/${id}`);
  },

  searchTools: async (search: string): Promise<ToolSearchResult[]> => {
    if (!search.trim()) return [];
    const { data } = await axiosInstance.get("/tools/search", {
      params: { search },
    });
    return data.data;
  },
};
