import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import advertisementService from "../services/advertisement.service";
import { advertisementKeys } from "./useAdvertisements";
import type {
  CreateAdvertisementPayload,
  UpdateAdvertisementPayload,
} from "../types/advertisement.types";

/**
 * NOTE: error messages assume axios errors carry a backend message at
 * error.response.data.message, matching the shared responseHandler
 * envelope used across the admin API. Adjust getErrorMessage() below
 * if the real envelope differs.
 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as any)?.response?.data?.message;
  return typeof message === "string" ? message : fallback;
};

export const useCreateAdvertisement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdvertisementPayload) =>
      advertisementService.createAdvertisement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.success("Advertisement created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create advertisement"));
    },
  });
};

export const useUpdateAdvertisement = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAdvertisementPayload) =>
      advertisementService.updateAdvertisement(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(advertisementKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.success("Advertisement updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update advertisement"));
    },
  });
};

export const useDeleteAdvertisement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => advertisementService.deleteAdvertisement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.success("Advertisement deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete advertisement"));
    },
  });
};

export const useMarkReady = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => advertisementService.markAdvertisementReady(id),
    onSuccess: (result) => {
      if (result.success && result.advertisement) {
        queryClient.setQueryData(
          advertisementKeys.detail(id),
          result.advertisement
        );
        queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
        toast.success("Advertisement marked as ready");
      }
      // When result.success is false, the caller reads result.errors
      // and renders them inline - no toast here to avoid duplicating
      // the on-page validation list.
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to mark advertisement ready"));
    },
  });
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      advertisementService.createAdvertisementVersion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.success("New draft version created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create new version"));
    },
  });
};
