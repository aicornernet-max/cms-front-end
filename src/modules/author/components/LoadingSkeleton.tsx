interface LoadingSkeletonProps {
  rows?: number;
}

export default function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div
      className="animate-pulse divide-y divide-gray-100"
      role="status"
      aria-label="Loading author profiles"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-4 sm:px-6">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
          </div>
          <div className="hidden h-6 w-16 rounded-full bg-gray-200 sm:block" />
          <div className="hidden h-3.5 w-24 rounded bg-gray-100 lg:block" />
          <div className="h-8 w-20 shrink-0 rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
