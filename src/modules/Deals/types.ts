export type DealStatus = "published" | "draft" | "archived";

export type DealType = "discount" | "freebie" | "bundle" | "trial" | string;

export type BillingType = "monthly" | "yearly" | "lifetime" | "one_time" | string;

export type CouponVisibility = "visible" | "hidden";

export interface DealTool {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  affiliateUrl: string;
  originalPrice: number;
  discountPrice: number;
  currency: string;
  startDate: string;
  endDate: string;
  isExpired: boolean;
  coverImage: string;
  status: DealStatus;
  billingType: BillingType;
  dealType: DealType;
  couponCode?: string;
  couponVisibility: CouponVisibility;
  tool: DealTool;
}

export interface DealsApiPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DealsApiResponse {
  success: boolean;
  message: string;
  data: {
    deals: Deal[];
    pagination: DealsApiPagination;
  };
}

/**
 * Filter shape used by <DealsFilters />. Kept as plain strings ("" = unset)
 * so it maps directly onto query params once server-side filtering ships.
 */
export interface DealsFilterState {
  status: DealStatus | "";
  dealType: string;
  billingType: string;
  toolId: string;
  couponVisibility: CouponVisibility | "";
  startDate: string;
  endDate: string;
}

export const EMPTY_DEALS_FILTERS: DealsFilterState = {
  status: "",
  dealType: "",
  billingType: "",
  toolId: "",
  couponVisibility: "",
  startDate: "",
  endDate: "",
};

export interface DealsQueryParams {
  page: number;
  limit: number;
  search?: string;
  filters?: DealsFilterState;
}
