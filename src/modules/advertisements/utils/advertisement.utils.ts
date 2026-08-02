import type { AdvertisementStatus } from "../types/advertisement.types";

export const STATUS_LABELS: Record<AdvertisementStatus, string> = {
  DRAFT: "Draft",
  READY: "Ready",
  LIVE: "Live",
  EXPIRED: "Expired",
};

export const STATUS_BADGE_CLASSES: Record<AdvertisementStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700 ring-gray-200",
  READY: "bg-amber-50 text-amber-700 ring-amber-200",
  LIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  EXPIRED: "bg-red-50 text-red-700 ring-red-200",
};

export const STATUS_OPTIONS: { value: AdvertisementStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "READY", label: "Ready" },
  { value: "LIVE", label: "Live" },
  { value: "EXPIRED", label: "Expired" },
];

export const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const formatDateTimeUtc = (
  isoString: string | null | undefined
): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.toISOString().slice(0, 16).replace("T", " ")} UTC`;
};

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${value}%`;
};

export const canEditAdvertisement = (status: AdvertisementStatus): boolean =>
  status === "DRAFT";

export const canDeleteAdvertisement = (status: AdvertisementStatus): boolean =>
  status === "DRAFT";

export const canMarkReady = (status: AdvertisementStatus): boolean =>
  status === "DRAFT";

export const canCreateVersion = (status: AdvertisementStatus): boolean =>
  status === "READY" || status === "LIVE";
