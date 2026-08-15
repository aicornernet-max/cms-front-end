import { AlertCircle, Check, Loader2 } from "lucide-react";

interface SectionSaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  isError?: boolean;
  errorMessage?: string;
  saveLabel?: string;
  onSave: () => void;
  disabled?: boolean;
}

export function SectionSaveBar({
  isDirty,
  isSaving,
  isError,
  errorMessage,
  saveLabel = "Save Changes",
  onSave,
  disabled,
}: SectionSaveBarProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1.5 text-xs font-medium">
        {isSaving ? (
          <span className="flex items-center gap-1.5 text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Saving…
          </span>
        ) : isError ? (
          <span className="flex items-center gap-1.5 text-red-600">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {errorMessage || "Failed to save"}
          </span>
        ) : isDirty ? (
          <span className="text-amber-600">Unsaved changes</span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-600">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Saved
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={disabled || isSaving || !isDirty}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSaving ? "Saving…" : saveLabel}
      </button>
    </div>
  );
}
