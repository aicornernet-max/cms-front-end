import { Loader2, Rocket, Trash2, Undo2 } from "lucide-react";
import type { SeoPageV2Status } from "../../types/seoPageV2.types";

interface SeoPageActionsProps {
  status: SeoPageV2Status;
  onPublish: () => void;
  isPublishing: boolean;
  onUnpublish?: () => void;
  isUnpublishing?: boolean;
  onDeleteDraft?: () => void;
  isDeletingDraft?: boolean;
}

export function SeoPageActions({
  status,
  onPublish,
  isPublishing,
  onUnpublish,
  isUnpublishing,
  onDeleteDraft,
  isDeletingDraft,
}: SeoPageActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onDeleteDraft ? (
        <button
          type="button"
          onClick={onDeleteDraft}
          disabled={isDeletingDraft}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {isDeletingDraft ? "Deleting…" : "Delete Draft"}
        </button>
      ) : null}

      {status === "published" && onUnpublish ? (
        <button
          type="button"
          onClick={onUnpublish}
          disabled={isUnpublishing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
          {isUnpublishing ? "Unpublishing…" : "Unpublish"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Rocket className="h-4 w-4" aria-hidden="true" />
          )}
          {isPublishing ? "Publishing…" : "Publish"}
        </button>
      )}
    </div>
  );
}
