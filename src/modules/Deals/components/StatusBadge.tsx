import type { DealStatus } from "../types/deal.types";

const STYLES: Record<DealStatus, string> = {
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const LABELS: Record<DealStatus, string> = {
  draft: "Draft",
  published: "Published",
};

export function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "draft" ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {LABELS[status]}
    </span>
  );
}
