import { useState } from "react";
import { Pagination, type PaginationMeta } from "../../components/common/Pagination";
import { ErrorState } from "../../components/common/ErrorState";
import { useDeals } from "./hooks/useDeals";
import { DealsHeader } from "./components/DealsHeader";
import { DealsSearch } from "./components/DealsSearch";
import { DealsFilters } from "./components/DealsFilters";
import { DealsTable } from "./components/DealsTable";
import { DealsLoadingSkeleton } from "./components/DealsLoadingSkeleton";
import { DealsEmptyState } from "./components/DealsEmptyState";
import { DeleteDealModal } from "./components/DeleteDealModal";
import { EMPTY_DEALS_FILTERS, type Deal, type DealsFilterState } from "./types";

export default function DealsListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DealsFilterState>(EMPTY_DEALS_FILTERS);
  const [dealPendingDelete, setDealPendingDelete] = useState<Deal | null>(null);

  const { data, isLoading, isError, refetch } = useDeals({ page, limit, search, filters });

  const deals = data?.data.deals ?? [];
  const apiPagination = data?.data.pagination;

  // Adapt the API's { totalItems } shape to the shared Pagination component's
  // { total } shape without touching the existing component.
  const paginationMeta: PaginationMeta = {
    page: apiPagination?.page ?? page,
    limit: apiPagination?.limit ?? limit,
    total: apiPagination?.totalItems ?? 0,
    totalPages: apiPagination?.totalPages ?? 1,
  };

  const isFiltered =
    search.trim().length > 0 ||
    Object.values(filters).some((value) => value !== "");

  const handleClearAll = () => {
    setSearch("");
    setFilters(EMPTY_DEALS_FILTERS);
    setPage(1);
  };

  const handleApplyFilters = (nextFilters: DealsFilterState) => {
    setFilters(nextFilters);
    setPage(1);
    // TODO: once server-side filtering ships, this is the only place
    // that needs to change — pass `filters` through to useDeals's queryKey.
  };

  const handleResetFilters = () => {
    setFilters(EMPTY_DEALS_FILTERS);
    setPage(1);
  };

  /**
   * Delete API already exists on the backend — this is intentionally left
   * as a placeholder per the current scope of work.
   */
  const handleDelete = (id: string) => {
    // TODO: call dealsApi.deleteDeal(id), then refetch() and show a toast.
    console.log("handleDelete placeholder called for deal:", id);
    setDealPendingDelete(null);
  };

  return (
    <div className="min-h-full bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <DealsHeader />

        <DealsSearch value={search} onChange={setSearch} />

        <DealsFilters
          filters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {isLoading ? (
          <DealsLoadingSkeleton rows={limit > 8 ? 8 : limit} />
        ) : isError ? (
          <ErrorState
            title="Couldn't load deals"
            message="Something went wrong while fetching the deals list."
            onRetry={() => refetch()}
          />
        ) : deals.length === 0 ? (
          <DealsEmptyState
            isFiltered={isFiltered}
            onClear={isFiltered ? handleClearAll : undefined}
          />
        ) : (
          <DealsTable deals={deals} onDeleteClick={setDealPendingDelete} />
        )}

        {!isLoading && !isError && deals.length > 0 && (
          <Pagination
            pagination={paginationMeta}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </div>

      <DeleteDealModal
        deal={dealPendingDelete}
        onCancel={() => setDealPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
