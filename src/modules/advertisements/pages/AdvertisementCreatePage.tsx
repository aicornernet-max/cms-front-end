import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAdvertisementSchema,
  type CreateAdvertisementFormValues,
} from "../validations/advertisement.validation";
import { useCreateAdvertisement } from "../hooks/useAdvertisementMutations";
import BookingAutocomplete from "../components/BookingAutocomplete";
import type { BookingSearchResult } from "../types/advertisement.types";

const AdvertisementCreatePage = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] =
    useState<BookingSearchResult | null>(null);
  const createMutation = useCreateAdvertisement();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateAdvertisementFormValues>({
    resolver: zodResolver(createAdvertisementSchema),
    defaultValues: { bookingId: "" },
  });

  const handleBookingChange = (booking: BookingSearchResult) => {
    setSelectedBooking(booking);
    setValue("bookingId", booking.id, { shouldValidate: true });
  };

  const onSubmit = (values: CreateAdvertisementFormValues) => {
    createMutation.mutate(values, {
      onSuccess: (advertisement) => {
        navigate(`/advertisements/${advertisement._id}`);
      },
    });
  };

  return (
    <div className="space-y-5 p-6">
      <div>
        <Link
          to="/advertisements"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          &larr; Back to advertisements
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Create Advertisement
        </h1>
        <p className="text-sm text-gray-500">
          Select a booking. The vendor and schedule snapshot will be copied
          automatically by the backend and cannot be edited afterward.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-5 rounded-lg border border-gray-200 bg-white p-5"
      >
        <BookingAutocomplete
          value={selectedBooking}
          onChange={handleBookingChange}
          error={errors.bookingId?.message}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/advertisements")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvertisementCreatePage;
