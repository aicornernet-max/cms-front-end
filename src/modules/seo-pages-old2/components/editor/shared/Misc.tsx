import { Check, Circle, Plus } from "lucide-react";
import { buttonSecondary } from "./styles";

export function ReviewItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span
        className={`grid h-8 w-8 place-items-center rounded-lg ${
          done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-300"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </span>
      <span className="text-sm font-semibold">{label}</span>
      <span className={`ml-auto text-xs font-semibold ${done ? "text-emerald-600" : "text-slate-400"}`}>
        {done ? "Ready" : "Incomplete"}
      </span>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ title, text, action, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm">
        <Plus className="h-5 w-5 text-slate-400" />
      </div>
      <p className="mt-3 text-sm font-bold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">{text}</p>
      {action && onAction && (
        <button onClick={onAction} className={`${buttonSecondary} mt-4`}>
          {action}
        </button>
      )}
    </div>
  );
}
