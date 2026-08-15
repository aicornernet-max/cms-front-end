import {
  FileText,
  CheckCircle2,
  FilePenLine,
  EyeOff,
  Wrench,
} from "lucide-react";
import type { PageSummary } from "../types";
import { formatNumber } from "../utils/formatters";

interface Props {
  summary: PageSummary;
}

const cards = [
  {
    key: "totalPages",
    label: "Total Pages",
    icon: FileText,
  },
  {
    key: "publishedPages",
    label: "Published",
    icon: CheckCircle2,
  },
  {
    key: "draftPages",
    label: "Draft",
    icon: FilePenLine,
  },
  {
    key: "unpublishedPages",
    label: "Unpublished",
    icon: EyeOff,
  },
  {
    key: "totalToolReferences",
    label: "Tools on Pages",
    icon: Wrench,
  },
] as const;

export const PageSummaryCards = ({ summary }: Props) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
    {cards.map(({ key, label, icon: Icon }) => (
      <div
        key={key}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {formatNumber(summary[key])}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
