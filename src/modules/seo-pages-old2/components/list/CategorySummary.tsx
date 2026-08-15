import type { CategorySummaryItem } from "../../types";
import { formatNumber } from "../../utils/formatters";

interface Props {
  categories: CategorySummaryItem[];
}

export const CategorySummary = ({ categories }: Props) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5">
      <h2 className="text-base font-semibold text-slate-900">
        Pages by Category
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Overall distribution of SEO pages and tool references.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.categoryId}
          className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="truncate text-sm font-semibold text-slate-900"
                title={category.categoryName}
              >
                {category.categoryName}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatNumber(category.pageCount)} pages ·{" "}
                {formatNumber(category.toolReferenceCount)} tools
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {category.percentage}%
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{
                width: `${Math.min(Math.max(category.percentage, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);
