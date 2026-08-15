import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authorService } from "../services/author.service";
import type { Author } from "../types/author.types";

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

/**
 * Loads a single author profile by id for the Edit page.
 */
export function useAuthor(id: string | undefined) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthor = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await authorService.getAuthorById(id);
      setAuthor(data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load author profile.");
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchAuthor();
  }, [fetchAuthor]);

  return { author, isLoading, error, refetch: fetchAuthor };
}
