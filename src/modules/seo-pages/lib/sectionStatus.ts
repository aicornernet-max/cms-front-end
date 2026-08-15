import type { SeoPageV2, SeoPageV2SectionId } from "../types/seoPageV2.types";

export function isSectionComplete(
  section: SeoPageV2SectionId,
  page: SeoPageV2 | undefined,
): boolean {
  if (!page) return false;

  switch (section) {
    case "basic":
      return Boolean(page.title && page.slug && page.categoryId);
    case "seo":
      return Boolean(page.meta?.title || page.meta?.description);
    case "authors":
      return Boolean(page.writtenBy || page.reviewedBy);
    case "content":
      return Boolean(page.content && page.content.trim().length > 0);
    case "tools":
      return Boolean(page.tools && page.tools.length > 0);
    case "faqs":
      return Boolean(page.faq && page.faq.length > 0);
    case "publish":
      return page.status === "published";
    default:
      return false;
  }
}
