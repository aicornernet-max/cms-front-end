import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { authorService } from "../services/author.service";

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

export function useAuthorStatus(onSuccess?: () => void) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const setAuthorStatus = useCallback(
    async (id: string, isActive: boolean) => {
      setUpdatingId(id);
      try {
        await authorService.updateAuthorStatus(id, { isActive });
        toast.success(
          isActive
            ? "Author activated successfully."
            : "Author deactivated successfully."
        );
        onSuccess?.();
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to update author status."));
      } finally {
        setUpdatingId(null);
      }
    },
    [onSuccess]
  );

  return { setAuthorStatus, updatingId };
}
