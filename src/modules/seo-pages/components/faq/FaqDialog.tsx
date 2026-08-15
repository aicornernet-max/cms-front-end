import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface FaqDialogProps {
  open: boolean;
  initialValues?: { question: string; answer: string };
  onClose: () => void;
  onSave: (values: { question: string; answer: string }) => void;
}

const EMPTY = { question: "", answer: "" };

export function FaqDialog({
  open,
  initialValues,
  onClose,
  onSave,
}: FaqDialogProps) {
  const [values, setValues] = useState(initialValues ?? EMPTY);

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? EMPTY);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const isValid = values.question.trim() && values.answer.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-base font-semibold text-slate-900">
            {initialValues ? "Edit FAQ" : "Add FAQ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <label
              htmlFor="faq-question"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Question
            </label>
            <input
              id="faq-question"
              autoFocus
              value={values.question}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, question: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="faq-answer"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Answer
            </label>
            <textarea
              id="faq-answer"
              rows={4}
              value={values.answer}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, answer: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={() =>
              onSave({
                question: values.question.trim(),
                answer: values.answer.trim(),
              })
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
