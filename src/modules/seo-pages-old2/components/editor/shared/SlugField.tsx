import { RotateCcw } from "lucide-react";
import { Label } from "./FormFields";
import { input } from "./styles";

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  disabled?: boolean;
}

export function SlugField({ value, onChange, onRegenerate, disabled }: SlugFieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <Label text="URL slug" required />
        <button
          type="button"
          onClick={onRegenerate}
          disabled={disabled}
          className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" />
          Regenerate from title
        </button>
      </div>
      <input
        className={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="best-ai-tools-for-developers"
        disabled={disabled}
      />
      <span className="mt-1.5 block text-xs text-slate-400">
        Auto-generated from the title until you edit it directly.
      </span>
    </label>
  );
}
