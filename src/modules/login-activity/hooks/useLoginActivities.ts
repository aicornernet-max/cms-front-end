import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getLoginActivities } from '../../../api/loginActivity.api';
import {
  DEFAULT_FILTERS,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  SEARCH_DEBOUNCE_MS,
} from '../constants';
import type {
  DateFilterPreset,
  LoginAction,
  LoginActivityFiltersState,
  LoginActivityItem,
  LoginActivityPaginationMeta,
  LoginActivityQueryParams,
  LoginActivityStatsData,
  LoginStatus,
  UseLoginActivitiesReturn,
} from '../types';

const getPresetDateRange = (
  preset: DateFilterPreset,
  from: string,
  to: string,
): Pick<LoginActivityQueryParams, "date" | "from" | "to"> => {
  switch (preset) {
    case "today":
      return { date: "today" };

    case "yesterday":
      return { date: "yesterday" };

    case "last7days":
      return { date: "last7days" };

    case "last30days":
      return { date: "last30days" };

    case "custom":
      return from && to ? { from, to } : {};

    default:
      return {};
  }
};

const buildQueryParams = (
  filters: LoginActivityFiltersState,
  page: number,
  limit: number,
  overrideSearch?: string,
): LoginActivityQueryParams => {
  const params: LoginActivityQueryParams = { page, limit };

  const search = overrideSearch !== undefined ? overrideSearch : filters.search;
  if (search.trim()) {
    params.search = search.trim();
  }

  if (filters.status !== 'all') {
    params.status = filters.status as LoginStatus;
  }

  if (filters.action !== 'all') {
    params.action = filters.action as LoginAction;
  }

  const dateRange = getPresetDateRange(filters.datePreset, filters.from, filters.to);
  Object.assign(params, dateRange);

  return params;
};

const EMPTY_PAGINATION: LoginActivityPaginationMeta = {
  total: 0,
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  totalPages: 1,
};

const EMPTY_STATS: LoginActivityStatsData = {
  totalRecords: 0,
  successfulLogins: 0,
  failedLogins: 0,
  todaysActivity: 0,
};

export const useLoginActivities = (): UseLoginActivitiesReturn => {
  const [filters, setFilters] = useState<LoginActivityFiltersState>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(DEFAULT_FILTERS.search);

  const [page, setPageState] = useState<number>(DEFAULT_PAGE);
  const [limit, setLimitState] = useState<number>(DEFAULT_LIMIT);

  const [items, setItems] = useState<LoginActivityItem[]>([]);
  const [pagination, setPagination] = useState<LoginActivityPaginationMeta>(EMPTY_PAGINATION);
  const [stats, setStats] = useState<LoginActivityStatsData>(EMPTY_STATS);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [refetchToken, setRefetchToken] = useState<number>(0);
  const isFirstSearchRun = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search field independently from other filters.
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
      if (isFirstSearchRun.current) {
        isFirstSearchRun.current = false;
        return;
      }
      setPageState(DEFAULT_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = buildQueryParams(filters, page, limit, debouncedSearch);
      const response = await getLoginActivities(params);
      setItems(response.data.data.items??[]);
      setPagination(response.data.data.pagination??EMPTY_PAGINATION);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load login activity.';
      setError(message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    debouncedSearch,
    filters.status,
    filters.action,
    filters.datePreset,
    filters.from,
    filters.to,
    refetchToken,
  ]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);

    try {

      const [totalRes, successRes, failedRes, todayRes] = await Promise.all([
        getLoginActivities({ page: 1, limit: 1 }),
        getLoginActivities({ page: 1, limit: 1, status: 'SUCCESS' }),
        getLoginActivities({ page: 1, limit: 1, status: 'FAILED' }),
        getLoginActivities({ page: 1, limit: 1, date: "today" }),
      ]);

      setStats({
        totalRecords: totalRes.data.data.pagination.total,
        successfulLogins: successRes.data.data.pagination.total,
        failedLogins: failedRes.data.data.pagination.total,
        todaysActivity: todayRes.data.data.pagination.total,
      });
    } catch {
      // Stats are supplementary; failures here should not block the table.
      setStats(EMPTY_STATS);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats, refetchToken]);

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const setStatus = useCallback((value: LoginStatus | 'all') => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPageState(DEFAULT_PAGE);
  }, []);

  const setAction = useCallback((value: LoginAction | 'all') => {
    setFilters((prev) => ({ ...prev, action: value }));
    setPageState(DEFAULT_PAGE);
  }, []);

  const setDatePreset = useCallback((value: DateFilterPreset) => {
    setFilters((prev) => ({
      ...prev,
      datePreset: value,
      from: value === 'custom' ? prev.from : '',
      to: value === 'custom' ? prev.to : '',
    }));
    setPageState(DEFAULT_PAGE);
  }, []);

  const setCustomDateRange = useCallback((from: string, to: string) => {
    setFilters((prev) => ({ ...prev, datePreset: 'custom', from, to }));
    setPageState(DEFAULT_PAGE);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch(DEFAULT_FILTERS.search);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(nextPage);
  }, []);

  const setLimit = useCallback((nextLimit: number) => {
    setLimitState(nextLimit);
    setPageState(DEFAULT_PAGE);
  }, []);

  const refetch = useCallback(() => {
    setRefetchToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(ERROR_TOAST_MESSAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const mergedFilters = useMemo<LoginActivityFiltersState>(
    () => filters,
    [filters],
  );

  return {
    items,
    pagination,
    stats,
    filters: mergedFilters,
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
  };
};

const ERROR_TOAST_MESSAGE = 'Could not load login activity.';