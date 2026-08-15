import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeactivateAuthorDialogProps {
  isOpen: boolean;
  authorName: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeactivateAuthorDialog({
  isOpen,
  authorName,
  isSubmitting,
  onConfirm,
  onCancel,
}: DeactivateAuthorDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-author-title"
        aria-describedby="deactivate-author-description"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <h2
          id="deactivate-author-title"
          className="mt-4 text-base font-semibold text-gray-900"
        >
          Deactivate this author?
        </h2>
        <p
          id="deactivate-author-description"
          className="mt-1 text-sm text-gray-500"
        >
          <span className="font-medium text-gray-700">{authorName}</span> will
          remain available in the CMS and can be activated again later.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}
