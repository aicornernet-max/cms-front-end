/**
 * booking.service.ts
 * All requests go through the project's existing, pre-configured axios
 * instance — no new client, no manual token handling.
 *
 * ASSUMPTION: `axiosInstance`'s `baseURL` already covers everything up to
 * (and including) the API version, e.g. "https://api.example.com/api/v1".
 * The backend mounts the booking module at "/api/v1/admin/bookings", so
 * routes below are relative to that as "/admin/bookings...". Adjust the
 * BASE_PATH constant if the project's axios instance is configured
 * differently.
 */

import axiosInstance from "../../../api/axios";
import type {
  ApiResponse,
  Booking,
  BookingListFilters,
  BookingListResponse,
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  CreateBookingPayload,
  SuggestedSlot,
  SuggestSlotsPayload,
  UpdateBookingPayload,
} from "../types/booking.types";

const BASE_PATH = "/v1/admin/bookings";

export const bookingService = {
  async checkAvailability(payload: CheckAvailabilityPayload): Promise<CheckAvailabilityResponse> {
    const { data } = await axiosInstance.post<ApiResponse<CheckAvailabilityResponse>>(
      `${BASE_PATH}/check-availability`,
      payload
    );
    return data.data;
  },

  async suggestSlots(payload: SuggestSlotsPayload): Promise<SuggestedSlot[]> {
    const { data } = await axiosInstance.post<ApiResponse<{ suggestedSlots: SuggestedSlot[] }>>(
      `${BASE_PATH}/suggest-slots`,
      payload
    );
    return data.data.suggestedSlots;
  },

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await axiosInstance.post<ApiResponse<Booking>>(BASE_PATH, payload);
    return data.data;
  },

  async getBooking(id: string): Promise<Booking> {
    const { data } = await axiosInstance.get<ApiResponse<Booking>>(`${BASE_PATH}/${id}`);
    return data.data;
  },

  async listBookings(filters: BookingListFilters): Promise<BookingListResponse> {
    // `search` has no backend endpoint today (see booking.types.ts); it is
    // intentionally not sent here and is applied client-side in useBookings().
    const { search: _search, ...serverFilters } = filters;
    const { data } = await axiosInstance.get<ApiResponse<BookingListResponse>>(BASE_PATH, {
      params: serverFilters,
    });
    return data.data;
  },

  async updateBooking(id: string, payload: UpdateBookingPayload): Promise<Booking> {
    const { data } = await axiosInstance.patch<ApiResponse<Booking>>(`${BASE_PATH}/${id}`, payload);
    return data.data;
  },

  async confirmBooking(id: string): Promise<Booking> {
    const { data } = await axiosInstance.patch<ApiResponse<Booking>>(`${BASE_PATH}/${id}/confirm`);
    return data.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const { data } = await axiosInstance.patch<ApiResponse<Booking>>(`${BASE_PATH}/${id}/cancel`);
    return data.data;
  },

  async completeBooking(id: string): Promise<Booking> {
    const { data } = await axiosInstance.patch<ApiResponse<Booking>>(`${BASE_PATH}/${id}/complete`);
    return data.data;
  },
};
