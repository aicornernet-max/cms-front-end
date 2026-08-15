import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RichTextEditor from "../../../../components/editor/RichTextEditor";
import { useUpdateContent } from "../../hooks/useUpdateSeoPageSection";
import { extractErrorMessage } from "../../lib/errors";
import type { SeoPageV2 } from "../../types/seoPageV2.types";
import { SectionSaveBar } from "../editor/SectionSaveBar";

interface ContentSectionProps {
  page: SeoPageV2;
  readOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function ContentSection({
  page,
  readOnly,
  onDirtyChange,
}: ContentSectionProps) {
  const [content, setContent] = useState(page.content ?? "");
  const updateContent = useUpdateContent(page._id);

  useEffect(() => {
    setContent(page.content ?? "");
  }, [page]);

  const isDirty = content !== (page.content ?? "");

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const handleSave = () => {
    updateContent.mutate(
      { content },
      {
        onSuccess: () => toast.success("Content saved"),
        onError: (error) =>
          toast.error(extractErrorMessage(error, "Failed to save content")),
      },
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Content</h2>
        <p className="mt-1 text-sm text-slate-500">
          The long-form body content for this page.
        </p>
      </div>

      <fieldset disabled={readOnly}>
        <RichTextEditor value={content} onChange={setContent} />
      </fieldset>

      <SectionSaveBar
        isDirty={isDirty}
        isSaving={updateContent.isPending}
        isError={updateContent.isError}
        onSave={handleSave}
        disabled={readOnly}
        saveLabel="Save Content"
      />
    </div>
  );
}
