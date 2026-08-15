import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateAuthors } from "../../hooks/useUpdateSeoPageSection";
import { extractErrorMessage } from "../../lib/errors";
import type {
  SeoPageV2,
  SeoPageV2AuthorProfile,
} from "../../types/seoPageV2.types";
import { AuthorSearchDialog } from "../authors/AuthorSearchDialog";
import { SelectedAuthorCard } from "../authors/SelectedAuthorCard";
import { SectionSaveBar } from "../editor/SectionSaveBar";

interface AuthorReviewSectionProps {
  page: SeoPageV2;
  readOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

type DialogTarget = "writtenBy" | "reviewedBy" | null;

export function AuthorReviewSection({
  page,
  readOnly,
  onDirtyChange,
}: AuthorReviewSectionProps) {
  const [writtenBy, setWrittenBy] = useState<SeoPageV2AuthorProfile | null>(
    page.writtenBy ?? null,
  );
  const [reviewedBy, setReviewedBy] = useState<SeoPageV2AuthorProfile | null>(
    page.reviewedBy ?? null,
  );
  const [dialogTarget, setDialogTarget] = useState<DialogTarget>(null);

  const updateAuthors = useUpdateAuthors(page._id);

  useEffect(() => {
    setWrittenBy(page.writtenBy ?? null);
    setReviewedBy(page.reviewedBy ?? null);
  }, [page]);

  const isDirty =
    (writtenBy?._id ?? null) !== (page.writtenBy?._id ?? null) ||
    (reviewedBy?._id ?? null) !== (page.reviewedBy?._id ?? null);

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const handleSave = () => {
    updateAuthors.mutate(
      {
        writtenBy: writtenBy?._id ?? null,
        reviewedBy: reviewedBy?._id ?? null,
      },
      {
        onSuccess: () => toast.success("Author & reviewer saved"),
        onError: (error) =>
          toast.error(extractErrorMessage(error, "Failed to save author & reviewer")),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Author & Review
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Attribute who wrote and who reviewed this page.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Written By</p>
        {writtenBy ? (
          <SelectedAuthorCard
            author={writtenBy}
            disabled={readOnly}
            onRemove={() => setWrittenBy(null)}
            onReplace={() => setDialogTarget("writtenBy")}
          />
        ) : (
          <button
            type="button"
            disabled={readOnly}
            onClick={() => setDialogTarget("writtenBy")}
            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Select author
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Reviewed By</p>
        {reviewedBy ? (
          <SelectedAuthorCard
            author={reviewedBy}
            disabled={readOnly}
            onRemove={() => setReviewedBy(null)}
            onReplace={() => setDialogTarget("reviewedBy")}
          />
        ) : (
          <button
            type="button"
            disabled={readOnly}
            onClick={() => setDialogTarget("reviewedBy")}
            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Select reviewer
          </button>
        )}
      </div>

      <SectionSaveBar
        isDirty={isDirty}
        isSaving={updateAuthors.isPending}
        isError={updateAuthors.isError}
        onSave={handleSave}
        disabled={readOnly}
        saveLabel="Save Author & Review"
      />

      <AuthorSearchDialog
        open={dialogTarget !== null}
        title={dialogTarget === "reviewedBy" ? "Select reviewer" : "Select author"}
        onClose={() => setDialogTarget(null)}
        onSelect={(author) => {
          if (dialogTarget === "writtenBy") setWrittenBy(author);
          if (dialogTarget === "reviewedBy") setReviewedBy(author);
        }}
      />
    </div>
  );
}
