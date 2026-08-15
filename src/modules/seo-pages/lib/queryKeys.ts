export const seoPageV2Keys = {
  all: ["seo-pages-v2"] as const,
  details: () => [...seoPageV2Keys.all, "detail"] as const,
  detail: (id: string) => [...seoPageV2Keys.details(), id] as const,
};

export const seoPageV2ToolSearchKeys = {
  all: ["seo-pages-v2", "tool-search"] as const,
  search: (query: string) => [...seoPageV2ToolSearchKeys.all, query] as const,
};

export const seoPageV2AuthorSearchKeys = {
  all: ["seo-pages-v2", "author-search"] as const,
  search: (query: string) =>
    [...seoPageV2AuthorSearchKeys.all, query] as const,
};

export const seoPageV2CategoryKeys = {
  all: ["seo-pages-v2", "categories"] as const,
};
