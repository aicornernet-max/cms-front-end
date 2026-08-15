import axios from "../../../api/axios";
import type {
  ApiResponse,
  AuthorsPayload,
  BasicPayload,
  Category,
  ContentPayload,
  CreatePagePayload,
  FaqsPayload,
  SeoPage,
  SeoPayload,
  ToolsPayload,
  AuthorProfile,
  Tool,
} from "../types/seoPageV2.types";

export const seoPageV2Service = {
  async create(payload: CreatePagePayload) {
    const response = await axios.post<ApiResponse<SeoPage>>("/pages-v2", payload);
    return response.data;
  },

  async get(id: string) {
    const response = await axios.get<ApiResponse<SeoPage>>(`/pages-v2/id/${id}`);
    return response.data;
  },

  async updateBasic(id: string, payload: BasicPayload) {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/basic`,
      payload,
    );
    return response.data;
  },

  async updateSeo(id: string, payload: SeoPayload) {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/seo`,
      payload,
    );
    return response.data;
  },

  async updateAuthors(id: string, payload: AuthorsPayload) {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/authors`,
      payload,
    );
    return response.data;
  },

  async updateContent(id: string, payload: ContentPayload) {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/content`,
      payload,
    );
    return response.data;
  },

  async updateTools(id: string, payload: ToolsPayload) {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/tools`,
      payload,
    );
    return response.data;
  },

  async updateFaqs(id: string, payload: FaqsPayload) {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/faqs`,
      payload,
    );
    return response.data;
  },

  async updateStatus(id: string, status: "draft" | "published" | "unpublished") {
    const response = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/status`,
      { status },
    );
    return response.data;
  },

  async createOrGetDraft(id: string) {
    const response = await axios.post<ApiResponse<SeoPage>>(`/pages-v2/${id}/edit`);
    return response.data;
  },

  async deleteDraft(id: string) {
    const response = await axios.delete<ApiResponse<null>>(`/pages-v2/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await axios.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  async searchTools(query: string) {
    const response = await axios.get<ApiResponse<Tool[]>>("/tools/search/", {
      params: { search: query },
    });
    return response.data;
  },

  async searchAuthors(query: string) {
    const response = await axios.get<ApiResponse<AuthorProfile[]>>(
      "/pages-v2/authors/search",
      { params: { search: query } },
    );
    return response.data;
  },
};
