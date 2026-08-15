export type PageStatus = "draft" | "published" | "unpublished";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface AuthorProfile {
  _id: string;
  name: string;
  email?: string;
  profileImage?: string;
}

export interface Tool {
  _id: string;
  name: string;
  brand?: string;
  images?: {
    tool?: { url?: string };
  };
  ratingValue?: number;
  reviewCount?: number;
}

export interface PageTool {
  toolId: string | Tool;
  customDescription: string;
  position: number;
}

export interface PageFaq {
  _id?: string;
  question: string;
  answer: string;
  position: number;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface SeoPage {
  _id: string;
  title: string;
  slug: string;
  pageDescription?: string;
  categoryDescription?: string;
  categoryId: string | Category;
  catImage?: { url?: string; public_id?: string };
  writtenBy?: string | AuthorProfile | null;
  reviewedBy?: string | AuthorProfile | null;
  meta?: PageMeta;
  content?: string;
  tools?: PageTool[];
  faq?: PageFaq[];
  status: PageStatus;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface CreatePagePayload {
  title: string;
  slug: string;
  categoryId: string;
}

export interface BasicPayload {
  title: string;
  slug: string;
  categoryId: string;
  pageDescription: string;
  categoryDescription: string;
}

export interface SeoPayload {
  meta: PageMeta;
}

export interface AuthorsPayload {
  writtenBy: string | null;
  reviewedBy: string | null;
}

export interface ContentPayload {
  content: string;
}

export interface ToolsPayload {
  tools: PageTool[];
}

export interface FaqsPayload {
  faq: PageFaq[];
}
