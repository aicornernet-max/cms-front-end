import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { SeoPageV2Status } from "../../types/seoPageV2.types";

const statusClasses: Record<SeoPageV2Status, string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/10",
  unpublished: "bg-slate-100 text-slate-600 ring-slate-500/10",
};

const statusLabel: Record<SeoPageV2Status, string> = {
  published: "Published",
  draft: "Draft",
  unpublished: "Unpublished",
};

interface SeoPageHeaderProps {
  title: string;
  slug?: string;
  status?: SeoPageV2Status;
  isDraftCopy?: boolean;
}

export function SeoPageHeader({
  title,
  slug,
  status,
  isDraftCopy,
}: SeoPageHeaderProps) {
  return (
    <div>
      <Link
        to="/pages"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to SEO Pages
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title || "Untitled Page"}
        </h1>

        {status ? (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[status]}`}
          >
            {statusLabel[status]}
          </span>
        ) : null}
      </div>

      {slug ? (
        <p className="mt-1 text-sm text-slate-500">/{slug}</p>
      ) : null}

      {isDraftCopy ? (
        <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
          You're editing a draft copy. The published page stays live until
          you publish these changes.
        </p>
      ) : null}
    </div>
  );
}
