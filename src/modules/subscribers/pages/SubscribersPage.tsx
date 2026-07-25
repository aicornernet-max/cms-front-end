import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SubscriberStats from "../components/SubscriberStats";
import SubscriberToolbar from "../components/SubscriberToolbar";
import SubscriberTable from "../components/SubscriberTable";
import DeleteSubscriberDialog from "../components/DeleteSubscriberDialog";
import { useSubscribers } from "../hooks/useSubscribers";
import { exportSubscribersToCsv } from "../utils/exportCsv";
import type { SubscriberWithMeta } from "../types/subscriber.types";

export default function SubscribersPage() {
  const {
    subscribers,
    pagination,
    stats,
    search,
    setSearch,
    page,
    setPage,
    isLoading,
    isRefreshing,
    deletingId,
    refresh,
    deleteSubscriber,
  } = useSubscribers();

  const [pendingDelete, setPendingDelete] = useState<SubscriberWithMeta | null>(
    null
  );

  const handleDeleteRequest = useCallback((subscriber: SubscriberWithMeta) => {
    setPendingDelete(subscriber);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deletingId) return; // don't allow closing mid-delete
    setPendingDelete(null);
  }, [deletingId]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await deleteSubscriber(pendingDelete._id, pendingDelete.email);
    setPendingDelete(null);
  }, [pendingDelete, deleteSubscriber]);

  const handleExport = useCallback(() => {
    if (subscribers.length === 0) {
      toast.error("There are no subscribers to export.");
      return;
    }
    exportSubscribersToCsv(subscribers);
    toast.success("Subscribers exported successfully.");
  }, [subscribers]);

  const canGoPrevious = page > 1;
  const canGoNext = page < pagination.totalPages;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage website newsletter subscribers.
          </p>
        </div>
      </div>

      <SubscriberStats
        total={stats.total}
        currentPage={stats.currentPage}
        desktop={stats.desktop}
        mobile={stats.mobile}
      />

      <SubscriberToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={refresh}
        onExport={handleExport}
        isRefreshing={isRefreshing}
        exportDisabled={isLoading || subscribers.length === 0}
      />

      <SubscriberTable
        subscribers={subscribers}
        isLoading={isLoading}
        onDeleteRequest={handleDeleteRequest}
      />

      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-700">{pagination.page}</span>{" "}
            of <span className="font-medium text-gray-700">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={!canGoPrevious}
              aria-label="Previous page"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(pagination.totalPages, current + 1))
              }
              disabled={!canGoNext}
              aria-label="Next page"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <DeleteSubscriberDialog
        isOpen={pendingDelete !== null}
        email={pendingDelete?.email ?? ""}
        isDeleting={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
