import { FilePenLine, FilePlus2, Loader2, Rocket, Trash2 } from "lucide-react";
import type { DealListItem } from "../types/deal.types";
import { StatusBadge } from "./StatusBadge";

interface DealsTableProps {
  deals: DealListItem[];
  creatingEditDraftId: string | null;
  deletingId: string | null;
  publishingId: string | null;
  onEditDraft: (deal: DealListItem) => void;
  onCreateEditDraft: (deal: DealListItem) => void;
  onPublish: (deal: DealListItem) => void;
  onDelete: (deal: DealListItem) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(deal: DealListItem) {
  if (deal.originalPrice == null) return "—";
  const currency = deal.currency ? `${deal.currency} ` : "";
  if (deal.discountPrice != null) {
    return (
      <span>
        <span className="text-slate-400 line-through">
          {currency}
          {deal.originalPrice}
        </span>{" "}
        <span className="font-medium text-slate-900">
          {currency}
          {deal.discountPrice}
        </span>
      </span>
    );
  }
  return `${currency}${deal.originalPrice}`;
}

export function DealsTable({
  deals,
  creatingEditDraftId,
  deletingId,
  publishingId,
  onEditDraft,
  onCreateEditDraft,
  onPublish,
  onDelete,
}: DealsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Tool / Title</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Billing</th>
            <th className="px-4 py-3">Deal Type</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Coupon</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deals.map((deal) => {
            const isCreatingDraft = creatingEditDraftId === deal.id;
            const isDeleting = deletingId === deal.id;
            const isPublishing = publishingId === deal.id;

            return (
              <tr key={deal.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {deal.coverImage ? (
                      <img
                        src={deal.coverImage}
                        alt={deal.title}
                        className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-md bg-slate-100" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">
                        {deal.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {deal.tool?.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{deal.slug}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={deal.status} />
                </td>
                <td className="px-4 py-3 text-slate-500 capitalize">
                  {deal.billingType ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-500 capitalize">
                  {deal.dealType ?? "—"}
                </td>
                <td className="px-4 py-3">{formatPrice(deal)}</td>
                <td className="px-4 py-3 text-slate-500">
                  {deal.couponCode ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(deal.startDate)} – {formatDate(deal.endDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {deal.status === "draft" ? (
                      <button
                        type="button"
                        onClick={() => onEditDraft(deal)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <FilePenLine className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    ) : null}
                    {deal.status === "draft" && (
                      <button
                        type="button"
                        disabled={isPublishing}
                        onClick={() => onPublish(deal)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 px-2.5 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-60"
                      >
                        {isPublishing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Rocket className="h-3.5 w-3.5" />
                        )}
                        Publish
                      </button>
                    )}
                    {deal.status === "published" && (
                      <button
                        type="button"
                        disabled={isCreatingDraft}
                        onClick={() => onCreateEditDraft(deal)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {isCreatingDraft ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <FilePlus2 className="h-3.5 w-3.5" />
                        )}
                        Create Edit Draft
                      </button>
                    )}
                    {deal.status === "draft" && (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onDelete(deal)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
