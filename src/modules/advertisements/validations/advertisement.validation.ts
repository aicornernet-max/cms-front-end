import { z } from "zod";

/**
 * NOTE: assumes "zod" is available and paired with
 * @hookform/resolvers/zod, following the common RHF + TS convention.
 * If the existing project uses yup instead, translate this schema's
 * rules 1:1 - the form component only depends on the inferred type
 * below, not on zod specifically.
 */
export const updateAdvertisementSchema = z.object({
  toolId: z.string().min(1, "Tool is required"),
  backgroundImage: z.string().url("Must be a valid URL").optional().nullable(),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be under 150 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),
  originalPrice: z
    .number({ invalid_type_error: "Original price must be a number" })
    .positive("Original price must be greater than 0"),
  dealPrice: z
    .number({ invalid_type_error: "Deal price must be a number" })
    .positive("Deal price must be greater than 0"),
  claimDealUrl: z.string().trim().url("Must be a valid URL"),
}).refine((data) => data.dealPrice <= data.originalPrice, {
  message: "Deal price cannot exceed original price",
  path: ["dealPrice"],
});

export type UpdateAdvertisementFormValues = z.infer<
  typeof updateAdvertisementSchema
>;

export const createAdvertisementSchema = z.object({
  bookingId: z.string().min(1, "Please select a booking"),
});

export type CreateAdvertisementFormValues = z.infer<
  typeof createAdvertisementSchema
>;
