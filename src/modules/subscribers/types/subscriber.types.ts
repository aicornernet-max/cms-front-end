export type DeviceType = "Desktop" | "Mobile" | "Tablet" | "API" | "Bot" | "Unknown";

export type BrowserType =
  | "Chrome"
  | "Firefox"
  | "Safari"
  | "Edge"
  | "Postman"
  | "Unknown";

export interface Subscriber {
  id: string;
  email: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscribersData {
  items: Subscriber[];
  pagination: Pagination;
}

export interface SubscribersResponse {
  success: boolean;
  message: string;
  data: SubscribersData;
}

export interface DeleteSubscriberResponse {
  success: boolean;
  message: string;
}

export interface SubscriberWithMeta extends Subscriber {
  device: DeviceType;
  browser: BrowserType;
}
