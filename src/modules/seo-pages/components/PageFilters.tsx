import { Search, RotateCcw } from "lucide-react";
import type { PageFilters as Filters, PublicCategory } from "../types";

interface Props {
  filters: Filters;
  categories: PublicCategory[];
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}

export const PageFilters = ({
  filters,
  categories,
  onChange,
  onClear,
}: Props) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(150px,180px)_auto)]">
      <label className="relative block">
        <span className="sr-only">Search pages</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by title, slug or description"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <select
        value={filters.categoryId}
        onChange={(event) => onChange({ categoryId: event.target.value })}
        aria-label="Category"
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(event) =>
          onChange({
            status: event.target.value as Filters["status"],
          })
        }
        aria-label="Status"
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="unpublished">Unpublished</option>
      </select>

      <select
        value={filters.toolsCount}
        onChange={(event) =>
          onChange({
            toolsCount: event.target.value as Filters["toolsCount"],
          })
        }
        aria-label="Tools count"
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Tools</option>
        <option value="0">0</option>
        <option value="1-5">1–5</option>
        <option value="6-10">6–10</option>
        <option value="10+">10+</option>
      </select>

      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Clear
      </button>
    </div>
  </div>
);
