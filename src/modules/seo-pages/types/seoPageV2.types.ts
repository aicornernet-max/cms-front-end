export type SeoPageV2Status = "draft" | "published" | "unpublished";

export interface SeoPageV2Image {
  url?: string;
  public_id?: string;
}

export interface SeoPageV2Category {
  _id: string;
  name: string;
  slug: string;
}

export interface SeoPageV2Meta {
  title: string;
  description: string;
  keywords: string[];
}

export interface SeoPageV2Tool {
  id: string;
  name?: string;
  image?: string;
  brand?: string;
  customDescription: string;
  position: number;
}

export interface SeoPageV2Faq {
  question: string;
  answer: string;
  position: number;
}

export interface SeoPageV2AuthorProfile {
  _id: string;
  name: string;
  slug?: string;
  profileImage?: string;
  bio?: string;
}

export interface SeoPageV2AuditUser {
  _id?: string;
  name?: string;
}

export interface SeoPageV2 {
  _id: string;
  title: string;
  slug: string;
  status: SeoPageV2Status;
  parentId?: string | null;
  category?: string;
  categoryId?: SeoPageV2Category | null;
  pageDescription?: string;
  categoryDescription?: string;
  catImage?: SeoPageV2Image | null;
  meta?: SeoPageV2Meta;
  writtenBy?: SeoPageV2AuthorProfile | null;
  reviewedBy?: SeoPageV2AuthorProfile | null;
  content?: string;
  tools?: SeoPageV2Tool[];
  faq?: SeoPageV2Faq[];
  createdBy?: SeoPageV2AuditUser | null;
  updatedBy?: SeoPageV2AuditUser | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeoPageV2ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SeoPageV2FieldError {
  field: string;
  message: string;
}

export interface SeoPageV2ValidationErrorPayload {
  success: false;
  message: string;
  errors?: SeoPageV2FieldError[];
}

export interface CreateSeoPageV2Payload {
  title: string;
  slug: string;
  categoryId: string;
}

export interface UpdateBasicPayload {
  title: string;
  slug: string;
  categoryId: string;
  pageDescription: string;
  categoryDescription: string;
  catImage?: SeoPageV2Image | null;
}

export interface UpdateSeoPayload {
  meta: SeoPageV2Meta;
}

export interface UpdateAuthorsPayload {
  writtenBy: string | null;
  reviewedBy: string | null;
}

export interface UpdateContentPayload {
  content: string;
}

export interface UpdateToolsPayload {
  tools: Array<{
    toolId: string;
    customDescription: string;
  }>;
}

export interface UpdateFaqsPayload {
  faq: Array<{
    question: string;
    answer: string;
    position: number;
  }>;
}

export interface UpdateStatusPayload {
  status: SeoPageV2Status;
}

export const SEO_PAGE_V2_SECTIONS = [
  "basic",
  "seo",
  "authors",
  "content",
  "tools",
  "faqs",
  "publish",
] as const;

export type SeoPageV2SectionId = (typeof SEO_PAGE_V2_SECTIONS)[number];
