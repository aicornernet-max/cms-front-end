import { z } from "zod";

export const BIO_MAX_WORDS = 50;

/**
 * Whitespace-aware word count — collapses runs of whitespace so
 * "Hello     world" counts as 2 words, not more.
 */
export function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    { message: "Please enter a valid URL." }
  );

export const socialLinksSchema = z.object({
  linkedin: optionalUrl,
  twitter: optionalUrl,
  facebook: optionalUrl,
  instagram: optionalUrl,
  github: optionalUrl,
});

export const authorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Author name is required."),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(
      slugPattern,
      "Slug must be lowercase, hyphen-separated, and contain no spaces or special characters."
    ),

  bio: z
    .string()
    .trim()
    .min(1, "Bio is required.")
    .refine(
      (value) => countWords(value) <= BIO_MAX_WORDS,
      { message: `Bio must be ${BIO_MAX_WORDS} words or fewer.` }
    ),

  isActive: z.boolean(),

  socialLinks: socialLinksSchema.optional(),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;
