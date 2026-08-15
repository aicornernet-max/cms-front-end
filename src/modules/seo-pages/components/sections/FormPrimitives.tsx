import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  fullWidth?: boolean;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  fullWidth,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export const inputErrorClass =
  "w-full rounded-lg border border-red-400 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";
