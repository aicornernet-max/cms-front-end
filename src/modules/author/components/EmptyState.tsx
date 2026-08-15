import { Link } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";

interface EmptyStateProps {
  /** True when a search/filter is active and produced no results. */
  isFiltered: boolean;
}

export default function EmptyState({ isFiltered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
        <UserRoundPlus className="h-7 w-7 text-gray-400" aria-hidden="true" />
      </div>

      {isFiltered ? (
        <>
          <h3 className="text-base font-semibold text-gray-900">
            No authors match your current search or filter.
          </h3>
          <p className="max-w-sm text-sm text-gray-500">
            Try a different name, slug, or status filter.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-gray-900">
            No author profiles found.
          </h3>
          <p className="max-w-sm text-sm text-gray-500">
            Create your first author profile to get started.
          </p>
          <Link
            to="/admin/authors/create"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
            Add Author
          </Link>
        </>
      )}
    </div>
  );
}
