import axios from "../../../api/axios";
import type { DealsApiResponse, DealsQueryParams } from "../types";

export const dealsApi = {
  /**
   * Fetches the paginated deals list.
   * `search` and `filters` are accepted in the signature now so the query
   * hook and UI never need to change shape later — today they're simply
   * not sent to the server yet (see requirements: no backend wiring for
   * search/filters in this pass).
   */
  getDeals: async ({ page, limit }: DealsQueryParams): Promise<DealsApiResponse> => {
    const res = await axios.get("/admin/deals", {
      params: { page, limit },
    });
    return res.data as DealsApiResponse;
  },

  /**
   * Delete API already exists on the backend. Wiring intentionally left
   * out for this pass — call sites use handleDelete(id) as a placeholder.
   */
  deleteDeal: async (_id: string): Promise<void> => {
    // TODO: await axios.delete(`/deals/${_id}`)
    return Promise.resolve();
  },
};
