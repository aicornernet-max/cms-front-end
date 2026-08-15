// ── Shared ────────────────────────────────────────────────────────────────

export type PageStatus = "draft" | "published" | "unpublished";

export interface ImageValue {
  url?: string;
  public_id?: string;
}

// ── List screen (GET /pages) ────────────────────────────────────────────

export interface PageCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface PageCreatedBy {
  _id?: string;
  name?: string;
}

export interface SeoPageListItem {
  _id: string;
  title: string;
  slug: string;
  status: PageStatus;
  updatedAt: string;
  catImage?: ImageValue | null;
  toolCount: number;
  faqCount: number;
  category?: PageCategory | null;
  createdBy?: PageCreatedBy | null;
}

export interface PageSummary {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  unpublishedPages: number;
  totalToolReferences: number;
}

export interface PagePagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategorySummaryItem {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  pageCount: number;
  toolReferenceCount: number;
  percentage: number;
}

export interface PagesResponseData {
  summary: PageSummary;
  pages: SeoPageListItem[];
  pagination: PagePagination;
  categorySummary: CategorySummaryItem[];
}

export interface PagesApiResponse {
  success: boolean;
  message: string;
  data: PagesResponseData;
}

export interface PublicCategory {
  _id: string;
  name: string;
  slug: string;
  totalPages?: number;
  totalTools?: number;
  totalToolsWithContent?: number;
}

export interface CategoriesApiResponse {
  success: boolean;
  message: string;
  summary?: {
    totalCategories: number;
    totalPages: number;
    totalTools: number;
    totalToolsWithContent: number;
  };
  data: PublicCategory[];
}

export interface PageFilters {
  search: string;
  categoryId: string;
  status: "" | PageStatus;
  toolsCount: "" | "0" | "1-5" | "6-10" | "10+";
}

export interface PageQueryParams extends PageFilters {
  page: number;
  limit: number;
}

export interface SeoPagesPageProps {
  onPreview?: (slug: string) => void;
  onEdit?: (pageId: string) => void;
  onCreate?: () => void;
}

// ── Editor (create / edit) ──────────────────────────────────────────────

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
  image?: ImageValue;
  images?: {
    tool?: ImageValue;
    hero?: ImageValue;
    faq?: ImageValue;
  };
  ratingValue?: number;
  reviewCount?: number;
}

/**
 * UI keeps the selected tool metadata so the editor can show its image/name.
 * The API payload MUST contain only toolId, customDescription and position.
 */
export interface PageTool {
  toolId: string;
  name?: string;
  brand?: string;
  image?: ImageValue;
  customDescription: string;
  position: number;
}

export interface PageFaq {
  _id?: string;
  clientId?: string;
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
  catImage?: ImageValue;
  writtenBy?: string | AuthorProfile | null;
  reviewedBy?: string | AuthorProfile | null;
  meta?: PageMeta;
  content?: string;
  tools?: PageTool[];
  faq?: PageFaq[];
  status: PageStatus;
  /** Set on a draft that was forked from a published page. */
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

// Section-by-section save payloads. These were referenced but never
// declared in the original v2 module (a broken-build bug) — defined here
// to match exactly what seoPageEditor.service.ts sends to the backend.

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
  faq: Array<Omit<PageFaq, "clientId" | "_id">>;
}

export type EditorSection =
  | "basic"
  | "seo"
  | "authors"
  | "content"
  | "tools"
  | "faq"
  | "publish";

export interface SeoPageEditorProps {
  mode: "create" | "edit";
  pageId?: string;
  /** Called after a page is created, or when the user leaves the editor. */
  onSaved?: (pageId: string) => void;
  /** Called when the user clicks "Preview". Defaults to /preview/:slug. */
  onPreview?: (slug: string) => void;
}
