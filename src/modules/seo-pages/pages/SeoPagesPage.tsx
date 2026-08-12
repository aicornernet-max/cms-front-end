import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { usePages } from "../hooks/usePages";
import { PageFilters } from "../components/PageFilters";
import { PageSummaryCards } from "../components/PageSummaryCards";
import { PageTable } from "../components/PageTable";
import { CategorySummary } from "../components/CategorySummary";
import type { PageFilters as Filters, SeoPagesPageProps } from "../types";
import { Pagination } from "../../../components/common/Pagination";

const DEFAULT_FILTERS: Filters = {
  search: "",
  categoryId: "",
  status: "",
  toolsCount: "",
};

const DEFAULT_LIMIT = 20;

export default function SeoPagesPage({
  onPreview,
  onEdit,
}: SeoPagesPageProps) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.categoryId,
    filters.status,
    filters.toolsCount,
  ]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch,
      categoryId: filters.categoryId,
      status: filters.status,
      toolsCount: filters.toolsCount,
    }),
    [
      page,
      limit,
      debouncedSearch,
      filters.categoryId,
      filters.status,
      filters.toolsCount,
    ],
  );

  const pagesQuery = usePages(queryParams);
  const categoriesQuery = useCategories();

  const data = pagesQuery.data?.data;

  const pagination = data?.pagination ?? {
    page: 1,
    limit,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const updateFilters = (patch: Partial<Filters>) => {
    setFilters((current) => ({
      ...current,
      ...patch,
    }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      (pagination.totalPages > 0 && nextPage > pagination.totalPages)
    ) {
      return;
    }

    setPage(nextPage);
  };

  const paginationForCommonComponent = {
    total: pagination.totalItems,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">SEO Management</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              SEO Pages
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and monitor your SEO listicle pages.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create SEO Page
          </button>
        </header>

        {pagesQuery.isError ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load SEO pages.
              </p>
              <p className="mt-1 text-xs text-red-600">
                Please try again.
              </p>
            </div>

            <button
              type="button"
              onClick={() => pagesQuery.refetch()}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry
            </button>
          </div>
        ) : null}

        {data ? (
          <PageSummaryCards summary={data.summary} />
        ) : (
          <div className="h-28 animate-pulse rounded-2xl bg-white" />
        )}

        <PageFilters
          filters={filters}
          categories={categoriesQuery.data?.data ?? []}
          onChange={updateFilters}
          onClear={clearFilters}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                SEO Pages
                <span className="ml-2 text-sm font-medium text-slate-400">
                  ({pagination.totalItems})
                </span>
              </h2>
            </div>

            {pagesQuery.isFetching && !pagesQuery.isLoading ? (
              <span className="text-xs font-medium text-slate-400">
                Updating…
              </span>
            ) : null}
          </div>

          <PageTable
            pages={data?.pages ?? []}
            isLoading={pagesQuery.isLoading}
            onPreview={onPreview}
            onEdit={onEdit}
          />

          <Pagination
            pagination={paginationForCommonComponent}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </section>

        {data ? (
          <CategorySummary categories={data.categorySummary} />
        ) : null}
      </div>
    </main>
  );
}
