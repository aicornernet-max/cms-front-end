import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useToolSearch } from "../../hooks/useSeoPageTools";
import type { ToolOption } from "../../../../shared/types/tool.types";

interface ToolSearchDialogProps {
  open: boolean;
  excludeToolIds: string[];
  onClose: () => void;
  onSelect: (tool: ToolOption) => void;
}

export function ToolSearchDialog({
  open,
  excludeToolIds,
  onClose,
  onSelect,
}: ToolSearchDialogProps) {
  const [query, setQuery] = useState("");
  const searchQuery = useToolSearch(query);

  if (!open) return null;

  const results = (searchQuery.data ?? []).filter(
    (tool) => !excludeToolIds.includes(tool.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-base font-semibold text-slate-900">
            Add a tool
          </h2>
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
              placeholder="Search tools by name…"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mt-3 max-h-72 overflow-y-auto">
            {searchQuery.isFetching ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Searching…
              </div>
            ) : query.trim() && results.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No matching tools found.
              </p>
            ) : !query.trim() ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Start typing to search.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {results.map((tool) => (
                  <li key={tool.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(tool);
                        setQuery("");
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left hover:bg-slate-50"
                    >
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="h-9 w-9 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {tool.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {tool.brand}
                        </p>
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
