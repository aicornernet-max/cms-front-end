interface DealsLoadingSkeletonProps {
  rows?: number;
}

export const DealsLoadingSkeleton = ({ rows = 6 }: DealsLoadingSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 p-4">
        <div className="h-3 w-full max-w-none animate-pulse rounded bg-gray-200/70" />
      </div>

      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-12 w-16 shrink-0 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/5 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="hidden w-24 space-y-2 sm:block">
              <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="hidden w-20 h-6 animate-pulse rounded-md bg-gray-100 md:block" />
            <div className="h-8 w-16 shrink-0 animate-pulse rounded-lg bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
};
