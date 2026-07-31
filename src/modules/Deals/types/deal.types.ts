export type DealStatus = "draft" | "published";

export type CouponVisibility = "visible" | "hidden";

// Common values seen in the API examples — extend if your backend supports more.
export const BILLING_TYPE_OPTIONS = [
  "monthly",
  "yearly",
  "lifetime",
  "one-time",
] as const;
export type BillingType = (typeof BILLING_TYPE_OPTIONS)[number];

export const DEAL_TYPE_OPTIONS = [
  "discount",
  "special-offer",
  "free-trial",
  "bundle",
] as const;
export type DealType = (typeof DEAL_TYPE_OPTIONS)[number];

export const COUPON_VISIBILITY_OPTIONS: CouponVisibility[] = [
  "visible",
  "hidden",
];

export interface ToolRef {
  id?: string;
  _id?: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
}

export interface ToolSearchResult {
  id: string;
  name: string;
  slug: string;
  brand: string;
  image: string;
}

export interface DealListItem {
  id: string;
  title: string;
  slug: string;
  affiliateUrl?: string;
  originalPrice?: number;
  discountPrice?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  isExpired?: boolean;
  coverImage?: string | null;
  status: DealStatus;
  billingType?: string;
  dealType?: string;
  couponCode?: string | null;
  couponVisibility?: CouponVisibility;
  tool: {
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
  };
}

export interface DealDetail {
  _id: string;
  toolId: ToolRef | string;
  parentDealId?: string | null;
  slug: string;
  title: string;
  couponCode?: string | null;
  couponVisibility: CouponVisibility;
  status: DealStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  billingType?: string;
  currency?: string;
  dealType?: string;
  description?: string;
  discountPrice?: number;
  endDate?: string;
  originalPrice?: number;
  startDate?: string;
  affiliateUrl?: string;
  coverImage?: string | null;
  coverImagePublicId?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PublishMissingFieldsError {
  totalMissingFields: number;
  missingFields: { field: string; label: string }[];
}

export interface PublishValidationError {
  errors: { field: string; message: string }[];
}

/** The shape of every field editable in the draft editor. */
export interface DealFormValues {
  title: string;
  slug: string;
  affiliateUrl?: string;
  originalPrice?: number | string;
  discountPrice?: number | string;
  currency?: string;
  billingType?: string;
  dealType?: string;
  couponCode?: string;
  couponVisibility?: CouponVisibility;
  startDate?: string;
  endDate?: string;
  description?: string;
}
