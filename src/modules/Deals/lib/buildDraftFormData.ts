import type { DealFormValues } from "../types/deal.types";

/**
 * Builds a FormData payload containing ONLY the fields listed in `changedKeys`,
 * plus an optional cover image file. This keeps PATCH /draft calls minimal,
 * matching the "only send modified fields" requirement.
 */
export function buildDraftFormData(
  values: DealFormValues,
  changedKeys: (keyof DealFormValues)[],
  coverImageFile?: File | null
): FormData {
  const formData = new FormData();

  for (const key of changedKeys) {
    const value = values[key];
    if (value === undefined || value === null) continue;
    formData.append(key, String(value));
  }

  if (coverImageFile) {
    formData.append("coverImage", coverImageFile);
  }

  return formData;
}
