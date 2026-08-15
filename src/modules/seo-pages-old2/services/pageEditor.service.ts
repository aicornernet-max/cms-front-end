import axios from "../../../api/axios";
import type {
  ApiResponse,
  AuthorProfile,
  AuthorsPayload,
  BasicPayload,
  Category,
  ContentPayload,
  CreatePagePayload,
  FaqsPayload,
  PageStatus,
  SeoPage,
  SeoPayload,
  Tool,
  ToolsPayload,
} from "../types";

export const pageEditorService = {
  async create(payload: CreatePagePayload) {
    const r = await axios.post<ApiResponse<SeoPage>>("/pages-v2", payload);
    return r.data;
  },

  async get(id: string) {
    const r = await axios.get<ApiResponse<SeoPage>>(`/pages-v2/id/${id}`);
    return r.data;
  },

  async updateBasic(
    id: string,
    payload: BasicPayload,
    imageFile?: File | null,
    removeImage = false,
  ) {
    if (imageFile || removeImage) {
      const fd = new FormData();
      Object.entries(payload).forEach(([key, value]) => fd.append(key, value));

      if (imageFile) {
        fd.append("catImage", imageFile);
      } else {
        fd.append("catImage", JSON.stringify({ url: "", public_id: "" }));
      }

      const r = await axios.patch<ApiResponse<SeoPage>>(
        `/pages-v2/${id}/basic`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return r.data;
    }

    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/basic`,
      payload,
    );
    return r.data;
  },

  async updateSeo(id: string, payload: SeoPayload) {
    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/seo`,
      payload,
    );
    return r.data;
  },

  async updateAuthors(id: string, payload: AuthorsPayload) {
    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/authors`,
      payload,
    );
    return r.data;
  },

  async updateContent(id: string, payload: ContentPayload) {
    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/content`,
      payload,
    );
    return r.data;
  },

  async updateTools(id: string, payload: ToolsPayload) {
    const apiPayload = {
      tools: payload.tools.map((tool) => ({
        toolId: tool.toolId,
        customDescription: tool.customDescription ?? "",
        position: tool.position,
      })),
    };

    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/tools`,
      apiPayload,
    );
    return r.data;
  },

  async updateFaqs(id: string, payload: FaqsPayload) {
    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/faqs`,
      payload,
    );
    return r.data;
  },

  async updateStatus(id: string, status: PageStatus) {
    const r = await axios.patch<ApiResponse<SeoPage>>(
      `/pages-v2/${id}/status`,
      { status },
    );
    return r.data;
  },

  /**
   * Published pages are read-only. This creates (or resumes) the linked
   * editable draft for a published page — the backend keys it off the
   * published page's id and returns/creates a page with parentId set.
   */
  async createOrGetDraft(id: string) {
    const r = await axios.post<ApiResponse<SeoPage>>(`/pages-v2/${id}/edit`);
    return r.data;
  },

  async deleteDraft(id: string) {
    const r = await axios.delete<ApiResponse<null>>(`/pages-v2/${id}`);
    return r.data;
  },

  async getCategories() {
    const r = await axios.get<ApiResponse<Category[]>>("/categories");
    return r.data;
  },

  async searchTools(query: string) {
    const r = await axios.get("/tools/search/", { params: { search: query } });
    const raw = r.data?.data ?? [];

    const data: Tool[] = raw
      .map((tool: any) => ({
        _id: String(tool._id ?? tool.id ?? ""),
        name: tool.name ?? "Untitled tool",
        brand: tool.brand,
        image:
          typeof tool.image === "string"
            ? { url: tool.image }
            : (tool.image ?? tool.images?.tool ?? undefined),
        images: tool.images,
        ratingValue: tool.ratingValue,
        reviewCount: tool.reviewCount,
      }))
      .filter((tool: Tool) => tool._id);

    return { ...r.data, data } as ApiResponse<Tool[]>;
  },

  async searchAuthors(query: string) {
    const r = await axios.get<ApiResponse<AuthorProfile[]>>(
      "/pages-v2/authors/search",
      { params: { search: query } },
    );
    return r.data;
  },
};
