import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../../../shared/Component/ConfirmModal";
import { usePublishSeoPageV2 } from "../../hooks/usePublishSeoPageV2";
import { extractErrorMessage, extractFieldErrors } from "../../lib/errors";
import type { SeoPageV2 } from "../../types/seoPageV2.types";
import { SeoPageActions } from "../editor/SeoPageActions";

interface PublishStatusSectionProps {
  page: SeoPageV2;
  onDeleteDraft?: () => void;
  isDeletingDraft?: boolean;
  onPublishSuccess?: () => void;
}

export function PublishStatusSection({
  page,
  onDeleteDraft,
  isDeletingDraft,
  onPublishSuccess,
}: PublishStatusSectionProps) {
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const publishMutation = usePublishSeoPageV2(page._id);

  const runStatusChange = (status: "published" | "unpublished") => {
    setPublishErrors([]);
    publishMutation.mutate(status, {
      onSuccess: () => {
        toast.success(
          status === "published" ? "Page published" : "Page unpublished",
        );
        if (status === "published") {
          onPublishSuccess?.();
        }
      },
      onError: (error) => {
        const errors = extractFieldErrors(error);
        if (errors.length > 0) {
          setPublishErrors(errors.map((e) => `${e.field}: ${e.message}`));
        }
        toast.error(extractErrorMessage(error, "Failed to update status"));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Publish & Status
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Control the visibility of this page on the live site.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          Current status:{" "}
          <span className="font-semibold capitalize text-slate-900">
            {page.status}
          </span>
        </p>
        {page.status === "draft" ? (
          <p className="mt-1 text-xs text-slate-500">
            This page is not visible on the live site until published.
          </p>
        ) : null}
        {page.parentId ? (
          <p className="mt-1 text-xs text-slate-500">
            This is a draft copy. Publishing will update the live page.
          </p>
        ) : null}
      </div>

      {publishErrors.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            This page can't be published yet
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-700">
            {publishErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <SeoPageActions
        status={page.status}
        onPublish={() => runStatusChange("published")}
        isPublishing={publishMutation.isPending}
        onUnpublish={() => runStatusChange("unpublished")}
        isUnpublishing={publishMutation.isPending}
        onDeleteDraft={
          page.status !== "published" && onDeleteDraft
            ? () => setConfirmDelete(true)
            : undefined
        }
        isDeletingDraft={isDeletingDraft}
      />

      <ConfirmModal
        open={confirmDelete}
        title="Delete this draft?"
        message="This permanently deletes the draft. This cannot be undone."
        loading={isDeletingDraft}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          onDeleteDraft?.();
          setConfirmDelete(false);
        }}
      />
    </div>
  );
}
