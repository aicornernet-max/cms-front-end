import { input } from "./styles";

export function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
      {text}
      {required && <span className="ml-1 text-red-500">*</span>}
    </span>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}

export function Field({ label, required, value, onChange, placeholder, hint, disabled }: FieldProps) {
  return (
    <label className="block">
      <Label text={label} required={required} />
      <input
        className={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

export function Textarea({ label, value, onChange, placeholder, hint }: TextareaProps) {
  return (
    <label className="block">
      <Label text={label} />
      <textarea
        className={`${input} min-h-[120px] resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
