import type { DealStatus } from "../types";

interface DealStatusBadgeProps {
  status: DealStatus;
}

const STATUS_STYLES: Record<DealStatus, string> = {
  published: "bg-green-50 text-green-700 border-green-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_LABELS: Record<DealStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

export const DealStatusBadge = ({ status }: DealStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
};
