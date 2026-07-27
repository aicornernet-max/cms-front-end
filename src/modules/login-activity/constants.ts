import type {
  DateFilterPreset,
  LoginActivityFiltersState,
  LoginAction,
  LoginStatus,
} from './types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const SEARCH_DEBOUNCE_MS = 400;

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

export const DEFAULT_FILTERS: LoginActivityFiltersState = {
  search: '',
  status: 'all',
  action: 'all',
  datePreset: 'all',
  from: '',
  to: '',
};

export const STATUS_OPTIONS: Array<{ label: string; value: LoginStatus | 'all' }> = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failed', value: 'FAILED' },
];

export const ACTION_OPTIONS: Array<{ label: string; value: LoginAction | 'all' }> = [
  { label: 'All Actions', value: 'all' },
  { label: 'Login', value: 'LOGIN' },
  { label: 'Logout', value: 'LOGOUT' },
];

export const DATE_FILTER_OPTIONS: Array<{ label: string; value: DateFilterPreset }> = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'Custom Range', value: 'custom' },
];

export const EMPTY_STATE_TITLE = 'No Login Activity Found';
export const EMPTY_STATE_DESCRIPTION =
  'No login activity matches your current filters.';

export const ERROR_STATE_TITLE = 'Something went wrong.';
export const ERROR_STATE_DESCRIPTION =
  'We could not load login activity right now. Please try again.';