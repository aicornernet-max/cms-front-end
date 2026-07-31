import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useToolSearch } from "../hooks/useToolSearch";
import type { ToolSearchResult } from "../types/deal.types";

interface ToolSearchSelectProps {
  selectedTool: ToolSearchResult | null;
  onSelect: (tool: ToolSearchResult) => void;
  onClear: () => void;
}

export function ToolSearchSelect({
  selectedTool,
  onSelect,
  onClear,
}: ToolSearchSelectProps) {
  const [query, setQuery] = useState("");
  const { data: results, isFetching } = useToolSearch(query);

  if (selectedTool) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <img
            src={selectedTool.image}
            alt={selectedTool.name}
            className="h-10 w-10 rounded-md object-cover ring-1 ring-slate-200"
          />
          <div>
            <p className="text-sm font-medium text-slate-900">
              {selectedTool.name}
            </p>
            <p className="text-xs text-slate-500">{selectedTool.brand}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Clear selected tool"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a tool by name…"
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-9 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {query.trim().length > 0 && (
        <div className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {!isFetching && results?.length === 0 && (
            <p className="p-3 text-sm text-slate-500">No tools found.</p>
          )}
          {results?.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                onSelect(tool);
                setQuery("");
              }}
              className="flex w-full items-center gap-3 p-3 text-left hover:bg-slate-50"
            >
              <img
                src={tool.image}
                alt={tool.name}
                className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-200"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {tool.name}
                </p>
                <p className="text-xs text-slate-500">{tool.brand}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
