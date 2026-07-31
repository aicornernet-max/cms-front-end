import { Loader2, Rocket } from "lucide-react";
import { AutoSaveIndicator, type AutoSaveStatus } from "./AutoSaveIndicator";

interface StickyPublishBarProps {
  onPublish: () => void;
  isPublishing: boolean;
  autoSaveStatus: AutoSaveStatus;
  errorCount?: number;
}

export function StickyPublishBar({
  onPublish,
  isPublishing,
  autoSaveStatus,
  errorCount = 0,
}: StickyPublishBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-4">
          <AutoSaveIndicator status={autoSaveStatus} />
          {errorCount > 0 && (
            <span className="text-sm font-medium text-red-600">
              {errorCount} field{errorCount > 1 ? "s" : ""} need attention
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          {isPublishing ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}
