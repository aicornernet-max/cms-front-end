import { useQuery } from "@tanstack/react-query";
import advertisementService from "../services/advertisement.service";
import type { AdvertisementListParams } from "../types/advertisement.types";

export const advertisementKeys = {
  all: ["advertisements"] as const,
  lists: () => [...advertisementKeys.all, "list"] as const,
  list: (params: AdvertisementListParams) =>
    [...advertisementKeys.lists(), params] as const,
  details: () => [...advertisementKeys.all, "detail"] as const,
  detail: (id: string) => [...advertisementKeys.details(), id] as const,
};

export const useAdvertisements = (params: AdvertisementListParams) => {
  return useQuery({
    queryKey: advertisementKeys.list(params),
    queryFn: () => advertisementService.getAdvertisements(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useAdvertisement = (id: string | undefined) => {
  return useQuery({
    queryKey: advertisementKeys.detail(id ?? ""),
    queryFn: () => advertisementService.getAdvertisementById(id as string),
    enabled: Boolean(id),
  });
};
