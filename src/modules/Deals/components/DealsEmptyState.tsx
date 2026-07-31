import { Tag } from "lucide-react";

interface DealsEmptyStateProps {
  isFiltered?: boolean;
  onClear?: () => void;
}

export const DealsEmptyState = ({ isFiltered, onClear }: DealsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Tag className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-base font-semibold text-gray-900">No deals found</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        {isFiltered
          ? "No deals match your current search or filters."
          : "Create your first deal to start promoting offers."}
      </p>

      {isFiltered && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 text-sm font-medium text-blue-600 hover:underline"
        >
          Clear search & filters
        </button>
      )}
    </div>
  );
};
