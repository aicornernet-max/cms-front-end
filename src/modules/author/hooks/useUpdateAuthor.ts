import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { authorService } from "../services/author.service";
import type { AuthorPayload } from "../types/author.types";
import type { AuthorFieldErrors } from "./useCreateAuthor";

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

function extractFieldError(error: unknown): AuthorFieldErrors | null {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { field?: string; message?: string } } })
      .response;
    const field = response?.data?.field;
    const message = response?.data?.message;
    if (field && message && ["slug", "name", "bio"].includes(field)) {
      return { [field]: message } as AuthorFieldErrors;
    }
  }
  return null;
}

export function useUpdateAuthor(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateAuthor = useCallback(
    async (id: string, payload: AuthorPayload): Promise<AuthorFieldErrors | null> => {
      setIsSubmitting(true);
      try {
        await authorService.updateAuthor(id, payload);
        toast.success("Author profile updated successfully.");
        onSuccess?.();
        return null;
      } catch (error) {
        const fieldError = extractFieldError(error);
        if (fieldError) {
          return fieldError;
        }
        toast.error(getErrorMessage(error, "Failed to update author profile."));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  return { updateAuthor, isSubmitting };
}
