import { UserRound, X } from "lucide-react";
import type { SeoPageV2AuthorProfile } from "../../types/seoPageV2.types";

interface SelectedAuthorCardProps {
  author: SeoPageV2AuthorProfile;
  onRemove: () => void;
  onReplace: () => void;
  disabled?: boolean;
}

export function SelectedAuthorCard({
  author,
  onRemove,
  onReplace,
  disabled,
}: SelectedAuthorCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200">
        {author.profileImage ? (
          <img
            src={author.profileImage}
            alt={author.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="h-5 w-5 text-slate-400" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {author.name}
        </p>
        {author.bio ? (
          <p className="truncate text-xs text-slate-500">{author.bio}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onReplace}
          disabled={disabled}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Replace
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${author.name}`}
          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
