import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import type { SeoPageListItem } from "../types";
import { formatDate } from "../utils/formatters";

interface Props {
  pages: SeoPageListItem[];
  isLoading: boolean;
  onPreview?: (pageId: string) => void;
  onEdit?: (pageId: string) => void;
}

const statusClasses: Record<SeoPageListItem["status"], string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/10",
  unpublished: "bg-slate-100 text-slate-600 ring-slate-500/10",
};

const statusLabel: Record<SeoPageListItem["status"], string> = {
  published: "Published",
  draft: "Draft",
  unpublished: "Unpublished",
};

const SkeletonRows = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <tr key={index} className="border-t border-slate-100">
        {Array.from({ length: 8 }).map((__, cellIndex) => (
          <td key={cellIndex} className="px-4 py-4">
            <div className="h-4 animate-pulse rounded bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const PageTable = ({
  pages,
  isLoading,
  onPreview,
  onEdit,
}: Props) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-[1050px] w-full text-left">
        <thead className="bg-slate-50">
          <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Page</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Tools</th>
            <th className="px-4 py-3 text-center">FAQ</th>
            <th className="px-4 py-3">Created By</th>
            <th className="px-4 py-3">Updated At</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <SkeletonRows />
          ) : pages.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-16 text-center text-sm text-slate-500"
              >
                No SEO pages found for the selected filters.
              </td>
            </tr>
          ) : (
            pages.map((page) => (
              <tr
                key={page._id}
                className="border-t border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="max-w-[360px] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {page.catImage?.url ? (
                        <img
                          src={page.catImage.url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                          SEO
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-semibold text-slate-900"
                        title={page.title}
                      >
                        {page.title}
                      </p>
                      <p
                        className="mt-1 truncate text-xs text-slate-400"
                        title={`/${page.slug}`}
                      >
                        /{page.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {page.category?.name ?? "—"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[page.status]}`}
                  >
                    {statusLabel[page.status]}
                  </span>
                </td>

                <td className="px-4 py-4 text-center text-sm font-semibold text-slate-700">
                  {page.toolCount}
                </td>

                <td className="px-4 py-4 text-center text-sm font-semibold text-slate-700">
                  {page.faqCount}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {page.createdBy?.name || "—"}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                  {formatDate(page.updatedAt)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onPreview?.(page._id)}
                      disabled={!onPreview}
                      title="Preview"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit?.(page._id)}
                      disabled={!onEdit}
                      title="Edit"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>

                    <button
                      type="button"
                      title="More actions"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
