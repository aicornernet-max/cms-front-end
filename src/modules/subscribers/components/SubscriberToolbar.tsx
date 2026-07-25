import { Search, RefreshCcw, Download } from "lucide-react";

interface SubscriberToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  isRefreshing: boolean;
  exportDisabled: boolean;
}

export default function SubscriberToolbar({
  search,
  onSearchChange,
  onRefresh,
  onExport,
  isRefreshing,
  exportDisabled,
}: SubscriberToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by email..."
          aria-label="Search subscribers by email"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh subscribers"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          Refresh
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exportDisabled}
          aria-label="Export subscribers as CSV"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>
    </div>
  );
}
