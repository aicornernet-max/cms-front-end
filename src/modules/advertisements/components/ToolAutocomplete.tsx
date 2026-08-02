import { useState } from "react";
import { useToolSearch } from "../hooks/useSearch";
import type { ToolSearchResult } from "../types/advertisement.types";

interface ToolAutocompleteProps {
  value: ToolSearchResult | null;
  onChange: (tool: ToolSearchResult) => void;
  error?: string;
}

const ToolAutocomplete = ({ value, onChange, error }: ToolAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: results, isFetching } = useToolSearch(query);

  const handleSelect = (tool: ToolSearchResult) => {
    onChange(tool);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Tool
      </label>

      {value && !isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-left text-sm hover:border-indigo-400"
        >
          <img src={value.image} alt={value.name} className="h-6 w-6 rounded object-cover" />
          <span className="font-medium text-gray-900">{value.name}</span>
          <span className="text-gray-400">&middot;</span>
          <span className="text-gray-500">{value.brand}</span>
        </button>
      ) : (
        <input
          type="text"
          value={query}
          autoFocus={isOpen}
          placeholder="Search tools by name..."
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          }`}
        />
      )}

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {isFetching && (
            <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
          )}
          {!isFetching && results?.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No tools found</div>
          )}
          {!isFetching &&
            results?.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <img src={tool.image} alt={tool.name} className="h-6 w-6 rounded object-cover" />
                <span className="font-medium text-gray-900">{tool.name}</span>
                <span className="text-gray-400">&middot;</span>
                <span className="text-gray-500">{tool.brand}</span>
              </button>
            ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default ToolAutocomplete;
