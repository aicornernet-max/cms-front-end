import axios from "axios";
import type { SeoPageV2FieldError } from "../types/seoPageV2.types";

/** Extracts per-field validation errors from a V2 API error response, if present. */
export function extractFieldErrors(error: unknown): SeoPageV2FieldError[] {
  if (!axios.isAxiosError(error)) return [];

  const payload = error.response?.data;

  if (Array.isArray(payload?.errors)) {
    return payload.errors as SeoPageV2FieldError[];
  }

  return [];
}

/** Extracts a human-readable message from a V2 API error response. */
export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }

    if (error.response?.status === 404) {
      return "This page could not be found. It may have been deleted.";
    }

    if (error.response?.status === 409) {
      return "This action conflicts with the page's current state.";
    }

    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }
  }

  return fallback;
}
