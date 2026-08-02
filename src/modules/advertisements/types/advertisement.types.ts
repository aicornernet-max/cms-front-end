export type AdvertisementStatus = "DRAFT" | "READY" | "LIVE" | "EXPIRED";

export interface ToolSnapshot {
  id: string;
  name: string;
  image: string;
  brand: string;
}

export interface VendorSnapshot {
  id: string;
  name: string;
  companyName: string;
}

export interface BookingSnapshot {
  id: string;
  bookingNumber: string;
  startDate: string;
  endDate: string;
}

export interface Advertisement {
  _id: string;
  bookingId: string;
  booking: BookingSnapshot;
  vendor: VendorSnapshot;
  tool: ToolSnapshot;
  version: number;
  parentVersion: number | null;
  status: AdvertisementStatus;
  backgroundImage: string | null;
  title: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  offerPercentage: number;
  claimDealUrl: string;
  utcStartDate: string;
  utcEndDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface AdvertisementListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdvertisementStatus | "";
  vendorId?: string;
  bookingId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateAdvertisementPayload {
  bookingId: string;
}

export interface UpdateAdvertisementPayload {
  toolId?: string;
  backgroundImage?: string | null;
  title?: string;
  description?: string;
  originalPrice?: number;
  dealPrice?: number;
  claimDealUrl?: string;
}

export interface AdvertisementValidationError {
  field: string;
  message: string;
}

/**
 * Shape returned by the "Mark Ready" endpoint when the backend rejects
 * the transition due to incomplete/invalid data. On success the backend
 * is assumed to return the updated Advertisement instead.
 */
export interface MarkReadyResult {
  success: boolean;
  advertisement?: Advertisement;
  errors?: AdvertisementValidationError[];
}

export interface ToolSearchResult {
  id: string;
  name: string;
  image: string;
  brand: string;
}

export interface BookingSearchResult {
  id: string;
  bookingNumber: string;
  vendorName: string;
  startDate: string;
  endDate: string;
}
