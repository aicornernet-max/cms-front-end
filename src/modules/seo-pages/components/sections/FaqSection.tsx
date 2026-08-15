import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useSaveSeoPageFaqs } from "../../hooks/useSeoPageFaqs";
import { extractErrorMessage } from "../../lib/errors";
import type { SeoPageV2 } from "../../types/seoPageV2.types";
import { SectionSaveBar } from "../editor/SectionSaveBar";
import { FaqDialog } from "../faq/FaqDialog";
import type { FaqItemData } from "../faq/FaqItem";
import { SortableFaqList } from "../faq/SortableFaqList";

interface FaqSectionProps {
  page: SeoPageV2;
  readOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

function makeLocalId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `faq-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toLocalFaqs(page: SeoPageV2): FaqItemData[] {
  return [...(page.faq ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((faq) => ({ ...faq, localId: makeLocalId() }));
}

function stripLocalId(faqs: FaqItemData[]) {
  return faqs.map(({ question, answer, position }) => ({
    question,
    answer,
    position,
  }));
}

export function FaqSection({ page, readOnly, onDirtyChange }: FaqSectionProps) {
  const [faqs, setFaqs] = useState<FaqItemData[]>(() => toLocalFaqs(page));
  const [initialFaqs, setInitialFaqs] = useState(() => stripLocalId(faqs));
  const [dialogState, setDialogState] = useState<
    { mode: "add" } | { mode: "edit"; localId: string } | null
  >(null);

  const saveFaqs = useSaveSeoPageFaqs(page._id);

  useEffect(() => {
    const next = toLocalFaqs(page);
    setFaqs(next);
    setInitialFaqs(stripLocalId(next));
  }, [page]);

  const isDirty =
    JSON.stringify(stripLocalId(faqs)) !== JSON.stringify(initialFaqs);

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const handleRemove = (localId: string) => {
    setFaqs((prev) =>
      prev
        .filter((f) => f.localId !== localId)
        .map((f, index) => ({ ...f, position: index + 1 })),
    );
  };

  const handleDialogSave = (values: { question: string; answer: string }) => {
    if (dialogState?.mode === "edit") {
      const { localId } = dialogState;
      setFaqs((prev) =>
        prev.map((f) => (f.localId === localId ? { ...f, ...values } : f)),
      );
    } else {
      setFaqs((prev) => [
        ...prev,
        { localId: makeLocalId(), position: prev.length + 1, ...values },
      ]);
    }
    setDialogState(null);
  };

  const handleSave = () => {
    saveFaqs.mutate(
      { faq: stripLocalId(faqs) },
      {
        onSuccess: () => toast.success("FAQs saved"),
        onError: (error) =>
          toast.error(extractErrorMessage(error, "Failed to save FAQs")),
      },
    );
  };

  const editingFaq =
    dialogState?.mode === "edit"
      ? faqs.find((f) => f.localId === dialogState.localId)
      : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">FAQs</h2>
          <p className="mt-1 text-sm text-slate-500">
            Frequently asked questions shown at the bottom of the page.
          </p>
        </div>

        <button
          type="button"
          disabled={readOnly}
          onClick={() => setDialogState({ mode: "add" })}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add FAQ
        </button>
      </div>

      <SortableFaqList
        faqs={faqs}
        disabled={readOnly}
        onReorder={setFaqs}
        onEdit={(localId) => setDialogState({ mode: "edit", localId })}
        onRemove={handleRemove}
      />

      <SectionSaveBar
        isDirty={isDirty}
        isSaving={saveFaqs.isPending}
        isError={saveFaqs.isError}
        onSave={handleSave}
        disabled={readOnly}
        saveLabel="Save FAQs"
      />

      <FaqDialog
        open={dialogState !== null}
        initialValues={editingFaq}
        onClose={() => setDialogState(null)}
        onSave={handleDialogSave}
      />
    </div>
  );
}
