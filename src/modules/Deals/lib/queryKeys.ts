import type { DealsListParams } from "../services/deals.api";

export const dealsKeys = {
  all: ["deals"] as const,
  lists: () => [...dealsKeys.all, "list"] as const,
  list: (params: DealsListParams) => [...dealsKeys.lists(), params] as const,
  details: () => [...dealsKeys.all, "detail"] as const,
  detail: (id: string) => [...dealsKeys.details(), id] as const,
};

export const toolsKeys = {
  all: ["tools"] as const,
  search: (query: string) => [...toolsKeys.all, "search", query] as const,
};
