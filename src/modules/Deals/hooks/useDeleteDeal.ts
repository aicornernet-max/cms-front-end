import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi } from "../services/deals.api";
import { dealsKeys } from "../lib/queryKeys";

export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}
