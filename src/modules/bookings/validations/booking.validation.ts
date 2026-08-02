import { z } from "zod";

/**
 * Mirrors the shape of the backend's Joi schemas (booking.validation.js).
 * This is form/UX validation only — the backend remains the source of truth
 * and is always re-checked server-side (availability, overlap, transitions).
 */

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");

const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .min(1, "Date is required");

const timeField = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in 24-hour HH:mm format")
  .min(1, "Time is required");

// No upper bound: bookings can run 24 / 48 / 72 / 96 hours or any custom
// duration, in 0.5-hour increments — matches booking.model.js / booking.validation.js.
const durationField = z
  .number({ invalid_type_error: "Duration is required" })
  .min(0.5, "Duration must be at least 0.5 hours")
  .refine((value) => Math.round(value * 2) === value * 2, {
    message: "Duration must be in 0.5-hour increments",
  });

const timezoneField = z.string().min(1, "Timezone is required");

export const checkAvailabilitySchema = z.object({
  vendorId: objectId,
  timezone: timezoneField,
  date: dateField,
  time: timeField,
  duration: durationField,
});

export type CheckAvailabilityFormValues = z.infer<typeof checkAvailabilitySchema>;

export const createBookingSchema = z.object({
  vendorId: objectId,
  clientId: objectId.optional().nullable(),
  clientName: z.string().trim().max(120, "Client name is too long").optional(),
  clientTimezone: timezoneField,
  localStartDate: dateField,
  localStartTime: timeField,
  durationHours: durationField,
  notes: z.string().trim().max(1000, "Notes are too long").optional(),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = createBookingSchema
  .omit({ vendorId: true })
  .partial()
  .refine((values) => Object.keys(values).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateBookingFormValues = z.infer<typeof updateBookingSchema>;
