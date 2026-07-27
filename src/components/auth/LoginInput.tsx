import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type LoginInputProps = {
  label: string;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  icon: LucideIcon;
  onChange: (value: string) => void;

  showPassword?: boolean;
  onTogglePassword?: () => void;
};

export default function LoginInput({
  label,
  type,
  name,
  value,
  placeholder,
  icon: Icon,
  onChange,
  showPassword,
  onTogglePassword,
}: LoginInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type={type}
          name={name}
          value={value}
          autoComplete={
            name === "email"
              ? "username"
              : "current-password"
          }
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required
          className="
          h-12
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          pl-12
          pr-12
          text-sm
          outline-none
          transition
          focus:border-blue-600
          focus:ring-4
          focus:ring-blue-100
          "
        />

        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}