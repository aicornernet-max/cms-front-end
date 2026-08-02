/**
 * Small, self-contained loading/empty/error states for this module.
 *
 * ASSUMPTION: swap these for the project's existing shared state components
 * if it already has generic <Skeleton />, <EmptyState />, or <ErrorState />
 * primitives — these are intentionally dependency-free so the module works
 * standalone either way.
 */

export function TableSkeleton({ rows = 6, columns = 7 }: { rows?: number; columns?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function EmptyState({
  title = "No bookings found",
  description = "Try adjusting your filters, or create a new booking to get started.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-4 py-16 text-center">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong while loading bookings.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}
