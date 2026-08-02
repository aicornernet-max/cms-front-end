import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AvailabilityChecker } from "./AvailabilityChecker";
import { createBookingSchema, type CreateBookingFormValues } from "../validations/booking.validation";
import type { CheckAvailabilityPayload, SuggestedSlot } from "../types/booking.types";
import { COMMON_TIMEZONES } from "../utils/booking.utils";

interface BookingFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateBookingFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: CreateBookingFormValues) => void;
  onCancel: () => void;
}

/**
 * Shared by the Create and Edit pages. In edit mode, `vendorId` is fixed
 * (matches the backend, which never accepts vendorId on PATCH) and the
 * availability checker is hidden — rescheduling re-checks overlap on the
 * backend automatically when the booking is saved.
 */
export function BookingForm({ mode, defaultValues, isSubmitting, onSubmit, onCancel }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      vendorId: "",
      clientName: "",
      clientTimezone: "UTC",
      localStartDate: "",
      localStartTime: "",
      durationHours: 24,
      notes: "",
      ...defaultValues,
    },
  });

  const [availabilityPayload, setAvailabilityPayload] = useState<CheckAvailabilityPayload | null>(null);

  const watchedFields = watch(["vendorId", "clientTimezone", "localStartDate", "localStartTime", "durationHours"]);

  const refreshAvailabilityPayload = () => {
    const [vendorId, timezone, date, time, duration] = watchedFields;
    if (!vendorId || !timezone || !date || !time || !duration) {
      setAvailabilityPayload(null);
      return;
    }
    setAvailabilityPayload({ vendorId, timezone, date, time, duration });
  };

  const handleSelectSuggestedSlot = (slot: SuggestedSlot) => {
    setValue("localStartDate", slot.localStartDate, { shouldValidate: true });
    setValue("localStartTime", slot.localStartTime, { shouldValidate: true });
    setValue("durationHours", slot.durationHours, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Vendor ID" error={errors.vendorId?.message}>
          <input
            type="text"
            {...register("vendorId")}
            disabled={mode === "edit"}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
          />
        </Field>

        <Field label="Client name" error={errors.clientName?.message}>
          <input
            type="text"
            {...register("clientName")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Timezone" error={errors.clientTimezone?.message}>
          <Controller
            name="clientTimezone"
            control={control}
            render={({ field }) => (
              <select {...field} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                {COMMON_TIMEZONES.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            )}
          />
        </Field>

        <Field label="Duration (hours)" error={errors.durationHours?.message}>
          <input
            type="number"
            step={0.5}
            min={0.5}
            {...register("durationHours", { valueAsNumber: true })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Start date" error={errors.localStartDate?.message}>
          <input
            type="date"
            {...register("localStartDate")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Start time" error={errors.localStartTime?.message}>
          <input
            type="time"
            {...register("localStartTime")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <textarea
          rows={3}
          {...register("notes")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </Field>

      {mode === "create" && (
        <div>
          <button
            type="button"
            onClick={refreshAvailabilityPayload}
            className="text-xs font-medium text-gray-500 underline underline-offset-2"
          >
            Sync fields for availability check
          </button>
          <div className="mt-2">
            <AvailabilityChecker payload={availabilityPayload} onSelectSlot={handleSelectSuggestedSlot} />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : mode === "create" ? "Create booking" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
