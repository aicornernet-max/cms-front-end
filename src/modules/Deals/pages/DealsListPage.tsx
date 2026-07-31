import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useDealsList } from "../hooks/useDealsList";
import { useCreateEditDraft } from "../hooks/useCreateEditDraft";
import { useDeleteDeal } from "../hooks/useDeleteDeal";
import { dealsApi } from "../services/deals.api";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import { DealsTable } from "../components/DealsTable";
import { SearchBar } from "../components/SearchBar";
import { StatusFilterTabs } from "../components/StatusFilterTabs";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/EmptyState";
import { TableSkeleton } from "../components/TableSkeleton";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { DealListItem, DealStatus } from "../types/deal.types";

export function DealsListPage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<DealStatus | "">("");
  const [page, setPage] = useState(1);
  const [dealToDelete, setDealToDelete] = useState<DealListItem | null>(null);

  const search = useDebouncedValue(searchInput, 400);

  const { data, isLoading, isFetching, isError, refetch } = useDealsList({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
  });

  const createEditDraft = useCreateEditDraft();
  const deleteDeal = useDeleteDeal();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const deals = data?.deals ?? [];

  async function handleCreateEditDraft(deal: DealListItem) {
    try {
      const draft = await createEditDraft.mutateAsync(deal.id);
      navigate(`/admin/deals/${draft._id}/edit`);
    } catch {
      toast.error("Failed to create edit draft");
    }
  }

  async function handlePublishDraft(deal: DealListItem) {
    setPublishingId(deal.id);
    try {
      await dealsApi.publish(deal.id);
      toast.success("Deal published");
      refetch();
    } catch {
      toast.error(
        "Couldn't publish — open the draft to review required fields."
      );
    } finally {
      setPublishingId(null);
    }
  }

  async function handleDelete() {
    if (!dealToDelete) return;
    try {
      await deleteDeal.mutateAsync(dealToDelete.id);
      toast.success("Deal deleted");
      setDealToDelete(null);
    } catch {
      toast.error("Failed to delete deal");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Deals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage promotional deals across every tool.
          </p>
        </div>
        <Link
          to="/admin/deals/create"
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-800"
        >
          <Plus className="h-4 w-4" />
          Create Deal
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              setPage(1);
            }}
          />
          <StatusFilterTabs
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <EmptyState
            title="Couldn't load deals"
            description="Something went wrong while fetching deals. Please try again."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Retry
              </button>
            }
          />
        ) : deals.length === 0 ? (
          <EmptyState
            title="No deals yet"
            description="Create your first deal to get started."
            action={
              <Link
                to="/admin/deals/create"
                className="rounded-lg bg-violet-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-violet-800"
              >
                Create Deal
              </Link>
            }
          />
        ) : (
          <>
            <DealsTable
              deals={deals}
              creatingEditDraftId={
                createEditDraft.isPending ? createEditDraft.variables ?? null : null
              }
              deletingId={deleteDeal.isPending ? dealToDelete?.id ?? null : null}
              publishingId={publishingId}
              onEditDraft={(deal) => navigate(`/admin/deals/${deal.id}/edit`)}
              onCreateEditDraft={handleCreateEditDraft}
              onPublish={handlePublishDraft}
              onDelete={(deal) => setDealToDelete(deal)}
            />
            {data && (
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!dealToDelete}
        title={`Delete "${dealToDelete?.title}"?`}
        description="This draft will be permanently removed. This action cannot be undone."
        isLoading={deleteDeal.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDealToDelete(null)}
      />
    </div>
  );
}
