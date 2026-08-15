import { useState } from "react";
import { Loader2, Search, UserRound, X } from "lucide-react";
import { useAuthorSearch } from "../../hooks/useAuthorSearch";
import type { SeoPageV2AuthorProfile } from "../../types/seoPageV2.types";

interface AuthorSearchDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSelect: (author: SeoPageV2AuthorProfile) => void;
}

export function AuthorSearchDialog({
  open,
  title,
  onClose,
  onSelect,
}: AuthorSearchDialogProps) {
  const [query, setQuery] = useState("");
  const searchQuery = useAuthorSearch(query);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mt-3 max-h-72 overflow-y-auto">
            {searchQuery.isFetching ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Searching…
              </div>
            ) : query.trim() && (searchQuery.data?.length ?? 0) === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No matching people found.
              </p>
            ) : !query.trim() ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Start typing to search.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {searchQuery.data?.map((author) => (
                  <li key={author._id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(author);
                        setQuery("");
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left hover:bg-slate-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {author.profileImage ? (
                          <img
                            src={author.profileImage}
                            alt={author.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound
                            className="h-4 w-4 text-slate-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {author.name}
                        </p>
                        {author.bio ? (
                          <p className="truncate text-xs text-slate-500">
                            {author.bio}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
