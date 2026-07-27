interface LoginActivitySkeletonProps {
  rows?: number;
}

export const LoginActivitySkeleton = ({ rows = 8 }: LoginActivitySkeletonProps): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div className="h-4 w-full max-w-3xl animate-pulse rounded bg-gray-200" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={rowIndex} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-40 flex-1 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            <div className="hidden h-4 w-24 animate-pulse rounded bg-gray-100 sm:block" />
            <div className="hidden h-4 w-24 animate-pulse rounded bg-gray-100 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
};