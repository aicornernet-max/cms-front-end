import { useQuery } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2AuthorSearchKeys } from "../lib/queryKeys";
import { useDebouncedValue } from "../lib/useDebouncedValue";

export function useAuthorSearch(rawQuery: string) {
  const query = useDebouncedValue(rawQuery.trim(), 300);

  return useQuery({
    queryKey: seoPageV2AuthorSearchKeys.search(query),
    queryFn: () => seoPageV2Api.searchAuthors(query),
    enabled: query.length > 0,
  });
}
