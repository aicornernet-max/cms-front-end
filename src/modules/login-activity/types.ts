export type LoginAction = 'LOGIN' | 'LOGOUT';
export type LoginStatus = 'SUCCESS' | 'FAILED';

export interface LoginActivityItem {
  _id: string;
  email: string;
  action: LoginAction;
  status: LoginStatus;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  sessionId: string;
  reason: string;
  createdAt: string;
}

export interface LoginActivityPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginActivityApiData {
  items: LoginActivityItem[];
  pagination: LoginActivityPaginationMeta;
}

export interface LoginActivityApiResponse {
  success: boolean;
  message: string;
  data: LoginActivityApiData;
}

export type DateFilterPreset =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'custom';

export interface LoginActivityFiltersState {
  search: string;
  status: LoginStatus | 'all';
  action: LoginAction | 'all';
  datePreset: DateFilterPreset;
  from: string;
  to: string;
}

export interface LoginActivityQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: LoginStatus;
  action?: LoginAction;
  date?: Exclude<DateFilterPreset, "all" | "custom">;
  from?: string;
  to?: string;
}

export interface LoginActivityStatsData {
  totalRecords: number;
  successfulLogins: number;
  failedLogins: number;
  todaysActivity: number;
}

export interface UseLoginActivitiesReturn {
  items: LoginActivityItem[];
  pagination: LoginActivityPaginationMeta;
  stats: LoginActivityStatsData;
  filters: LoginActivityFiltersState;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  setSearch: (value: string) => void;
  setStatus: (value: LoginStatus | 'all') => void;
  setAction: (value: LoginAction | 'all') => void;
  setDatePreset: (value: DateFilterPreset) => void;
  setCustomDateRange: (from: string, to: string) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refetch: () => void;
}