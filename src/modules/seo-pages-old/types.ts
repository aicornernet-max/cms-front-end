export type PageStatus = "draft" | "published" | "unpublished";

export interface ImageValue {
  url?: string;
  public_id?: string;
}

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
  onPreview?: (pageId: string) => void;
  onEdit?: (pageId: string) => void;
}
