import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { subscriberService } from "../services/subscriber.service";
import { detectDevice } from "../utils/device";
import { detectBrowser } from "../utils/browser";
import type { Pagination, SubscriberWithMeta } from "../types/subscriber.types";

const DEFAULT_LIMIT = 10;

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<SubscriberWithMeta[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchSubscribers = useCallback(
    async (targetPage: number, options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (silent) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const response = await subscriberService.getSubscribers({
          page: targetPage,
          limit: DEFAULT_LIMIT,
        });

        const enriched: SubscriberWithMeta[] = response.data.items.map(
          (item) => ({
            ...item,
            device: detectDevice(item.userAgent),
            browser: detectBrowser(item.userAgent),
          })
        );

        setSubscribers(enriched);
        setPagination(response.data.pagination);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load subscribers."));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSubscribers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const refresh = useCallback(() => {
    fetchSubscribers(page, { silent: true });
  }, [fetchSubscribers, page]);

  const deleteSubscriber = useCallback(
    async (id: string, email: string) => {
      setDeletingId(id);
      try {
        await subscriberService.deleteSubscriber(id);
        toast.success(`Subscriber "${email}" removed successfully.`);

        // If this was the only item on the last page, step back a page.
        const isLastItemOnPage = subscribers.length === 1 && page > 1;
        const nextPage = isLastItemOnPage ? page - 1 : page;
        if (nextPage !== page) {
          setPage(nextPage);
        } else {
          await fetchSubscribers(nextPage, { silent: true });
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to delete subscriber."));
      } finally {
        setDeletingId(null);
      }
    },
    [fetchSubscribers, page, subscribers.length]
  );

  const filteredSubscribers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subscribers;
    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(query)
    );
  }, [subscribers, search]);

  const stats = useMemo(() => {
    const desktopCount = subscribers.filter((s) => s.device === "Desktop").length;
    const mobileCount = subscribers.filter((s) => s.device === "Mobile").length;

    return {
      total: pagination.total,
      currentPage: subscribers.length,
      desktop: desktopCount,
      mobile: mobileCount,
    };
  }, [subscribers, pagination.total]);

  return {
    subscribers: filteredSubscribers,
    allSubscribers: subscribers,
    pagination,
    stats,
    search,
    setSearch,
    page,
    setPage,
    isLoading,
    isRefreshing,
    deletingId,
    refresh,
    deleteSubscriber,
  };
}
