import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seoPageV2Api } from "../services/seoPageV2.service";
import { seoPageV2Keys } from "../lib/queryKeys";
import type {
  SeoPageV2,
  UpdateAuthorsPayload,
  UpdateBasicPayload,
  UpdateContentPayload,
  UpdateSeoPayload,
} from "../types/seoPageV2.types";

function useSectionSave<TPayload>(
  id: string | undefined,
  save: (id: string, payload: TPayload) => Promise<SeoPageV2>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TPayload) => {
      if (!id) throw new Error("Missing page id");
      return save(id, payload);
    },
    onSuccess: (updated) => {
      if (id) {
        queryClient.setQueryData(seoPageV2Keys.detail(id), updated);
      }
    },
  });
}

export function useUpdateBasic(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      catImageFile,
    }: {
      payload: UpdateBasicPayload;
      catImageFile?: File | null;
    }) => {
      if (!id) throw new Error("Missing page id");
      return seoPageV2Api.updateBasic(id, payload, catImageFile);
    },
    onSuccess: (updated) => {
      if (id) {
        queryClient.setQueryData(seoPageV2Keys.detail(id), updated);
      }
    },
  });
}

export function useUpdateSeo(id: string | undefined) {
  return useSectionSave<UpdateSeoPayload>(id, seoPageV2Api.updateSeo);
}

export function useUpdateAuthors(id: string | undefined) {
  return useSectionSave<UpdateAuthorsPayload>(id, seoPageV2Api.updateAuthors);
}

export function useUpdateContent(id: string | undefined) {
  return useSectionSave<UpdateContentPayload>(id, seoPageV2Api.updateContent);
}
