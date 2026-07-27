import { RotateCcw, Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import {
  ACTION_OPTIONS,
  DATE_FILTER_OPTIONS,
  STATUS_OPTIONS,
} from '../constants';
import type {
  DateFilterPreset,
  LoginAction,
  LoginActivityFiltersState,
  LoginStatus,
} from '../types';

interface LoginActivityFiltersProps {
  filters: LoginActivityFiltersState;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LoginStatus | 'all') => void;
  onActionChange: (value: LoginAction | 'all') => void;
  onDatePresetChange: (value: DateFilterPreset) => void;
  onCustomDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
}

const selectClassName =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-auto';

export const LoginActivityFilters = ({
  filters,
  onSearchChange,
  onStatusChange,
  onActionChange,
  onDatePresetChange,
  onCustomDateRangeChange,
  onReset,
}: LoginActivityFiltersProps) => {
  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCustomDateRangeChange(event.target.value, filters.to);
  };

  const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCustomDateRangeChange(filters.from, event.target.value);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchInput}
            placeholder="Search by email"
            aria-label="Search by email"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={filters.status}
          onChange={(event) => onStatusChange(event.target.value as LoginStatus | 'all')}
          aria-label="Filter by status"
          className={selectClassName}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.action}
          onChange={(event) => onActionChange(event.target.value as LoginAction | 'all')}
          aria-label="Filter by action"
          className={selectClassName}
        >
          {ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.datePreset}
          onChange={(event) => onDatePresetChange(event.target.value as DateFilterPreset)}
          aria-label="Filter by date"
          className={selectClassName}
        >
          {DATE_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {filters.datePreset === 'custom' && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="date"
              value={filters.from}
              onChange={handleFromChange}
              aria-label="From date"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-auto"
            />
            <span className="hidden text-sm text-gray-400 sm:inline">to</span>
            <input
              type="date"
              value={filters.to}
              onChange={handleToChange}
              aria-label="To date"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-auto"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 sm:ml-auto sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
};