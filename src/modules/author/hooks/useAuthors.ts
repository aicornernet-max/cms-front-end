import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authorService } from "../services/author.service";
import { ROWS_PER_PAGE_OPTIONS } from "../../../components/common/Pagination";
import type { PaginationMeta } from "../../../components/common/Pagination";
import type { Author, StatusFilter } from "../types/author.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT: number = ROWS_PER_PAGE_OPTIONS[0];
const SEARCH_DEBOUNCE_MS = 400;

const EMPTY_PAGINATION: PaginationMeta = {
  total: 0,
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  totalPages: 1,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response
      .data.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(EMPTY_PAGINATION);

  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatusState] = useState<StatusFilter>("all");

  const [page, setPageState] = useState(DEFAULT_PAGE);
  const [limit, setLimitState] = useState(DEFAULT_LIMIT);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const isFirstSearchRun = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search independently of other filters so the API isn't hit
  // on every keystroke.
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      if (isFirstSearchRun.current) {
        isFirstSearchRun.current = false;
        return;
      }
      setPageState(DEFAULT_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authorService.getAuthors({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        isActive:
          status === "all" ? undefined : status === "active" ? true : false,
      });

      setAuthors(response.data.authors ?? []);
      setPagination(response.data.pagination ?? EMPTY_PAGINATION);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load author profiles.");
      setError(message);
      toast.error(message);
      setAuthors([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, status, refetchToken]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void fetchAuthors();
  }, [fetchAuthors]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
  }, []);

  const setStatus = useCallback((value: StatusFilter) => {
    setStatusState(value);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setPage = useCallback((value: number) => {
    setPageState(value);
  }, []);

  const setLimit = useCallback((value: number) => {
    setLimitState(value);
    setPageState(DEFAULT_PAGE);
  }, []);

  const refetch = useCallback(() => {
    setRefetchToken((prev) => prev + 1);
  }, []);

  return {
    authors,
    pagination,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    limit,
    setLimit,
    isLoading,
    error,
    refetch,
  };
}
