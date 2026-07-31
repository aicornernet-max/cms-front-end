import { CheckCircle2, Loader2, AlertCircle, Circle } from "lucide-react";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

const CONFIG: Record<
  AutoSaveStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  idle: {
    label: "No changes yet",
    className: "text-slate-400",
    icon: <Circle className="h-3.5 w-3.5" />,
  },
  saving: {
    label: "Saving…",
    className: "text-slate-500",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  saved: {
    label: "Saved",
    className: "text-emerald-600",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  error: {
    label: "Save failed",
    className: "text-red-600",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
};

export function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  const { label, className, icon } = CONFIG[status];
  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
