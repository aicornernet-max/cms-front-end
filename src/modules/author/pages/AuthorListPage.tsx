import { useCallback, useState } from "react";
import {Pagination} from "../../../components/common/Pagination";
import AuthorToolbar from "../components/AuthorToolbar";
import AuthorTable from "../components/AuthorTable";
import DeactivateAuthorDialog from "../components/DeactivateAuthorDialog";
import { useAuthors } from "../hooks/useAuthors";
import { useAuthorStatus } from "../hooks/useAuthorStatus";
import type { Author } from "../types/author.types";

export default function AuthorListPage() {
  const {
    authors,
    pagination,
    search,
    setSearch,
    status,
    setStatus,
    setPage,
    setLimit,
    isLoading,
    refetch,
  } = useAuthors();

  const { setAuthorStatus, updatingId } = useAuthorStatus(refetch);

  const [pendingDeactivate, setPendingDeactivate] = useState<Author | null>(null);

  const handleDeactivateRequest = useCallback((author: Author) => {
    setPendingDeactivate(author);
  }, []);

  const handleCancelDeactivate = useCallback(() => {
    if (updatingId) return;
    setPendingDeactivate(null);
  }, [updatingId]);

  const handleConfirmDeactivate = useCallback(async () => {
    if (!pendingDeactivate) return;
    await setAuthorStatus(pendingDeactivate._id, false);
    setPendingDeactivate(null);
  }, [pendingDeactivate, setAuthorStatus]);

  const handleActivate = useCallback(
    (author: Author) => {
      void setAuthorStatus(author._id, true);
    },
    [setAuthorStatus]
  );

  const isFiltered = search.trim() !== "" || status !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Author Profiles</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage author profiles used across published content.
        </p>
      </div>

      <AuthorToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <AuthorTable
        authors={authors}
        isLoading={isLoading}
        isFiltered={isFiltered}
        updatingId={updatingId}
        onDeactivateRequest={handleDeactivateRequest}
        onActivate={handleActivate}
      />

      {!isLoading && authors.length > 0 && (
        <Pagination pagination={pagination} onPageChange={setPage} onLimitChange={setLimit} />
      )}

      <DeactivateAuthorDialog
        isOpen={pendingDeactivate !== null}
        authorName={pendingDeactivate?.name ?? ""}
        isSubmitting={updatingId !== null}
        onConfirm={handleConfirmDeactivate}
        onCancel={handleCancelDeactivate}
      />
    </div>
  );
}
