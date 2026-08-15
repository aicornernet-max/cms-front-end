import axiosInstance from "../../../api/axios";
import type { ToolOption } from "../../../shared/types/tool.types";
import type {
  CreateSeoPageV2Payload,
  SeoPageV2,
  SeoPageV2ApiResponse,
  SeoPageV2AuthorProfile,
  UpdateAuthorsPayload,
  UpdateBasicPayload,
  UpdateContentPayload,
  UpdateFaqsPayload,
  UpdateSeoPayload,
  UpdateStatusPayload,
  UpdateToolsPayload,
} from "../types/seoPageV2.types";

const BASE_PATH = "/pages-v2";

export const seoPageV2Api = {
  createPage: async (
    payload: CreateSeoPageV2Payload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.post<SeoPageV2ApiResponse<SeoPageV2>>(
      BASE_PATH,
      payload,
    );
    return data.data;
  },

  getPage: async (id: string): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.get<SeoPageV2ApiResponse<SeoPageV2>>(
      `${BASE_PATH}/id/${id}`,
    );
    return data.data;
  },

  deletePage: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${BASE_PATH}/${id}`);
  },

  createOrGetDraft: async (publishedId: string): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.post<SeoPageV2ApiResponse<SeoPageV2>>(
      `${BASE_PATH}/${publishedId}/edit`,
    );
    return data.data;
  },

  updateBasic: async (
    id: string,
    payload: UpdateBasicPayload,
    catImageFile?: File | null,
  ): Promise<SeoPageV2> => {
    // No dedicated image-upload endpoint exists in this codebase (see
    // src/features/page V1, which sends the file inline on the same
    // request). We follow that same transport: multipart only when a new
    // file is attached, plain JSON otherwise.
    if (catImageFile) {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("slug", payload.slug);
      formData.append("categoryId", payload.categoryId);
      formData.append("pageDescription", payload.pageDescription);
      formData.append("categoryDescription", payload.categoryDescription);
      formData.append("catImage", catImageFile);

      const { data } = await axiosInstance.patch<
        SeoPageV2ApiResponse<SeoPageV2>
      >(`${BASE_PATH}/${id}/basic`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    }

    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/basic`, payload);
    return data.data;
  },

  updateSeo: async (
    id: string,
    payload: UpdateSeoPayload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/seo`, payload);
    return data.data;
  },

  updateAuthors: async (
    id: string,
    payload: UpdateAuthorsPayload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/authors`, payload);
    return data.data;
  },

  updateContent: async (
    id: string,
    payload: UpdateContentPayload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/content`, payload);
    return data.data;
  },

  updateTools: async (
    id: string,
    payload: UpdateToolsPayload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/tools`, payload);
    return data.data;
  },

  updateFaqs: async (
    id: string,
    payload: UpdateFaqsPayload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/faqs`, payload);
    return data.data;
  },

  updateStatus: async (
    id: string,
    payload: UpdateStatusPayload,
  ): Promise<SeoPageV2> => {
    const { data } = await axiosInstance.patch<
      SeoPageV2ApiResponse<SeoPageV2>
    >(`${BASE_PATH}/${id}/status`, payload);
    return data.data;
  },

  searchTools: async (search: string): Promise<ToolOption[]> => {
    if (!search.trim()) return [];
    const { data } = await axiosInstance.get<
      SeoPageV2ApiResponse<ToolOption[]>
    >("/tools/search/", { params: { search } });
    return data.data;
  },

  searchAuthors: async (
    search: string,
  ): Promise<SeoPageV2AuthorProfile[]> => {
    if (!search.trim()) return [];
    const { data } = await axiosInstance.get<
      SeoPageV2ApiResponse<SeoPageV2AuthorProfile[]>
    >(`${BASE_PATH}/authors/search`, { params: { search } });
    return data.data;
  },
};
