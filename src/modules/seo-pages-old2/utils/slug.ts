/**
 * Turns a title into a URL-safe slug.
 * "Best AI Tools for Developers!" -> "best-ai-tools-for-developers"
 */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
