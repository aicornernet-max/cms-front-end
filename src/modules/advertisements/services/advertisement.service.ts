import axiosInstance from "../../../api/axios";
import type {
  Advertisement,
  AdvertisementListParams,
  // BookingSearchResult,
  CreateAdvertisementPayload,
  MarkReadyResult,
  PaginatedResult,
  ToolSearchResult,
  UpdateAdvertisementPayload,
} from "../types/advertisement.types";

/**
 * NOTE: paths below are relative to axiosInstance's configured baseURL
 * (assumed to already point at the API root, e.g. "/api/v1/admin").
 * Adjust the base path prefix here if your axiosInstance is scoped
 * differently.
 */
const BASE_PATH = "/v1/admin/advertisements";

const getAdvertisements = async (
  params: AdvertisementListParams
): Promise<PaginatedResult<Advertisement>> => {
  const { data } = await axiosInstance.get(BASE_PATH, { params });
  // Assumes backend responds with { data: { vendors|items, pagination } }
  // wrapped by the shared successResponse envelope. Adjust the
  // destructuring below if your envelope shape differs.
  return {
    items: data.data.items ?? data.data.advertisements ?? [],
    pagination: data.data.pagination,
  };
};

const getAdvertisementById = async (id: string): Promise<Advertisement> => {
  const { data } = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return data.data;
};

const createAdvertisement = async (
  payload: CreateAdvertisementPayload
): Promise<Advertisement> => {
  const { data } = await axiosInstance.post(BASE_PATH, payload);
  return data.data;
};

const updateAdvertisement = async (
  id: string,
  payload: UpdateAdvertisementPayload
): Promise<Advertisement> => {
  const { data } = await axiosInstance.patch(`${BASE_PATH}/${id}`, payload);
  return data.data;
};

const deleteAdvertisement = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${BASE_PATH}/${id}`);
};

const markAdvertisementReady = async (id: string): Promise<MarkReadyResult> => {
  const { data } = await axiosInstance.patch(`${BASE_PATH}/${id}/ready`);
  return data.data;
};

const createAdvertisementVersion = async (
  id: string
): Promise<Advertisement> => {
  const { data } = await axiosInstance.post(`${BASE_PATH}/${id}/versions`);
  return data.data;
};

/**
 * Reuses the existing Tool Search API. Endpoint path assumed - adjust
 * to match the real one already used elsewhere in the project.
 */
const searchTools = async (search: string): Promise<ToolSearchResult[]> => {
  const { data } = await axiosInstance.get("/tools/search/", {
    params: { search },
  });
  return data.data;
};

/**
 * Used on the Create Advertisement page so the admin can pick a
 * booking. Endpoint path assumed to exist on the Booking module.
 */
// const searchBookings = async (
//   query: string
// ): Promise<BookingSearchResult[]> => {
//   const { data } = await axiosInstance.get("/bookings/search", {
//     params: { query },
//   });
//   return data.data;
// };

export default {
  getAdvertisements,
  getAdvertisementById,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  markAdvertisementReady,
  createAdvertisementVersion,
  searchTools,
  // searchBookings,
};
