import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { dealsApi } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";
import type {
  PublishMissingFieldsError,
  PublishValidationError,
} from "../types/deal.types";

export interface PublishFieldError {
  field: string;
  message: string;
}

/** Normalizes both known error shapes returned by the publish endpoint. */
export function extractPublishFieldErrors(error: unknown): PublishFieldError[] {
  if (!axios.isAxiosError(error)) return [];
  const payload = error.response?.data;
  if (!payload?.data) return [];

  const missing = payload.data as Partial<PublishMissingFieldsError>;
  if (Array.isArray(missing.missingFields)) {
    return missing.missingFields.map((f) => ({
      field: f.field,
      message: `${f.label} is required`,
    }));
  }

  const validation = payload.data as Partial<PublishValidationError>;
  if (Array.isArray(validation.errors)) {
    return validation.errors.map((e) => ({
      field: e.field,
      message: e.message,
    }));
  }

  return [];
}

export function extractPublishMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message as string;
  }
  return "Failed to publish deal.";
}

export function usePublishDraft(draftId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!draftId) throw new Error("Missing draft id");
      return dealsApi.publish(draftId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}
