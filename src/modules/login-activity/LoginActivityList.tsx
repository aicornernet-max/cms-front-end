import { AlertTriangle, RotateCw } from 'lucide-react';
import { ERROR_STATE_DESCRIPTION, ERROR_STATE_TITLE } from './constants';
import { LoginActivityFilters } from './components/LoginActivityFilters';
import { LoginActivityPagination } from './components/LoginActivityPagination';
import { LoginActivitySkeleton } from './components/LoginActivitySkeleton';
import { LoginActivityStats } from './components/LoginActivityStats';
import { LoginActivityTable } from './components/LoginActivityTable';
import { EmptyLoginActivity } from './components/EmptyLoginActivity';
import { useLoginActivities } from './hooks/useLoginActivities';

const ErrorState = ({ onRetry }: { onRetry: () => void })=> (
  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
      <AlertTriangle className="h-7 w-7 text-red-500" aria-hidden="true" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-gray-900">{ERROR_STATE_TITLE}</h3>
    <p className="mt-1 max-w-sm text-sm text-gray-500">{ERROR_STATE_DESCRIPTION}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
    >
      <RotateCw className="h-4 w-4" aria-hidden="true" />
      Retry
    </button>
  </div>
);

export const LoginActivityList = () => {
  const {
    items,
    pagination,
    stats,
    filters,
    isLoading,
    isStatsLoading,
    error,
    setSearch,
    setStatus,
    setAction,
    setDatePreset,
    setCustomDateRange,
    resetFilters,
    setPage,
    setLimit,
    refetch,
  } = useLoginActivities();

  const showEmptyState = !isLoading && !error && items.length === 0;
  const showTable = !isLoading && !error && items.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 bg-gray-50 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Login Activity</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor administrator authentication history, login attempts, and logout events.
        </p>
      </div>

      <LoginActivityStats stats={stats} isLoading={isStatsLoading} />

      <LoginActivityFilters
        filters={filters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onActionChange={setAction}
        onDatePresetChange={setDatePreset}
        onCustomDateRangeChange={setCustomDateRange}
        onReset={resetFilters}
      />

      {isLoading && <LoginActivitySkeleton />}
      {error && !isLoading && <ErrorState onRetry={refetch} />}
      {showEmptyState && <EmptyLoginActivity />}
      {showTable && <LoginActivityTable items={items} />}

      {!error && (
        <LoginActivityPagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  );
};

export default LoginActivityList;