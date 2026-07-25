import axiosInstance from "../../../api/axios";
import type {
  DeleteSubscriberResponse,
  SubscribersResponse,
} from "../types/subscriber.types";

export interface GetSubscribersParams {
  page?: number;
  limit?: number;
}

/**
 * Fetches the paginated list of subscribers.
 * All API access for this module goes through this service —
 * components and hooks must never call axios directly.
 */
async function getSubscribers(
  params: GetSubscribersParams = {}
): Promise<SubscribersResponse> {
  const { data } = await axiosInstance.get<SubscribersResponse>(
    "/v1/admin/subscribers",
    { params }
  );
  return data;
}

/**
 * Deletes a subscriber by id.
 */
async function deleteSubscriber(id: string): Promise<DeleteSubscriberResponse> {
  const { data } = await axiosInstance.delete<DeleteSubscriberResponse>(
    `/v1/admin/subscribers/${id}`
  );
  return data;
}

export const subscriberService = {
  getSubscribers,
  deleteSubscriber,
};
