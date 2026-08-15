import type { ReactNode } from "react";
import { Check, Loader2, Save, ChevronRight } from "lucide-react";
import { buttonPrimary, buttonSecondary } from "./styles";
import type { EditorSection } from "../../../types";

interface SectionCardProps {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function SectionCard({ title, eyebrow, description, children, footer }: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
        <div className="flex gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
            {eyebrow}
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-6 sm:px-7 sm:py-7">{children}</div>
      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">{footer}</div>
      )}
    </div>
  );
}

interface FooterProps {
  saveLabel: string;
  onSave: () => void;
  saving: boolean;
  next?: EditorSection;
  onNext?: () => void;
  previous?: EditorSection;
  onPrevious?: () => void;
  saved: boolean;
}

export function Footer({ saveLabel, onSave, saving, next, onNext, previous, onPrevious, saved }: FooterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" /> Saved successfully
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            Save your changes before moving to another section.
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onPrevious} disabled={!previous || saving} className={buttonSecondary}>
          Back
        </button>
        <button onClick={onSave} disabled={saving} className={buttonSecondary}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : saveLabel}
        </button>
        {next && onNext && (
          <button onClick={onNext} disabled={saving} className={buttonPrimary}>
            Save & continue <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
