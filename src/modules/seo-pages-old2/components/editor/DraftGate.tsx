import { Lock, Loader2, PenLine } from "lucide-react";
import { buttonPrimary } from "./shared";

interface DraftGateProps {
  title: string;
  creatingDraft: boolean;
  onStartDraft: () => void;
}

/**
 * Shown instead of the editor form when the page being opened is the
 * published version. Published pages are read-only — editing only starts
 * once the user explicitly asks to create (or resume) the linked draft.
 */
export function DraftGate({ title, creatingDraft, onStartDraft }: DraftGateProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
        <Lock className="h-6 w-6 text-slate-500" />
      </div>
      <h2 className="mt-4 text-xl font-bold tracking-tight">{title || "This page is live"}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Published pages can't be edited directly. Create an editable draft to make changes —
        the live page stays untouched until you publish the draft.
      </p>
      <button
        onClick={onStartDraft}
        disabled={creatingDraft}
        className={`${buttonPrimary} mx-auto mt-6`}
      >
        {creatingDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
        {creatingDraft ? "Creating draft…" : "Create editable draft"}
      </button>
    </div>
  );
}
