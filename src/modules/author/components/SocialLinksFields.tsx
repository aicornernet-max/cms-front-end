import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Link2 } from "lucide-react";
import type { AuthorFormValues } from "../validation/author.validation";

interface SocialLinksFieldsProps {
  register: UseFormRegister<AuthorFormValues>;
  errors: FieldErrors<AuthorFormValues>;
}

// Note: lucide-react no longer ships brand/logo icons (Linkedin, Twitter,
// Facebook, Instagram, Github were removed), so each field uses the same
// generic link icon and relies on its label for differentiation.
const SOCIAL_FIELDS = [
  { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { name: "twitter", label: "Twitter / X", placeholder: "https://x.com/username" },
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { name: "github", label: "GitHub", placeholder: "https://github.com/username" },
] as const;

export default function SocialLinksFields({ register, errors }: SocialLinksFieldsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Social Links</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SOCIAL_FIELDS.map(({ name, label, placeholder }) => {
          const fieldError = errors.socialLinks?.[name]?.message;
          return (
            <div key={name} className="space-y-1.5">
              <label
                htmlFor={`author-social-${name}`}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </label>
              <input
                id={`author-social-${name}`}
                type="text"
                placeholder={placeholder}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? `author-social-${name}-error` : undefined}
                {...register(`socialLinks.${name}`)}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  fieldError
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {fieldError && (
                <p id={`author-social-${name}-error`} className="text-xs text-red-600">
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

