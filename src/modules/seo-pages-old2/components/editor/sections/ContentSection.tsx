import { SectionCard, Footer } from "../shared";
import RichTextEditor from "../../../../../components/editor/RichTextEditor";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function ContentSection({ editor }: { editor: SeoPageEditor }) {
  return (
    <SectionCard
      title="Content"
      eyebrow="04"
      description="Write the page using the same rich-text editor already used by the CMS."
      footer={
        <Footer
          saveLabel="Save content"
          onSave={() => editor.save("content")}
          saving={editor.saving}
          next={editor.nextSection}
          onNext={() => editor.save("content", editor.nextSection)}
          previous={editor.previousSection}
          onPrevious={() => editor.setActive(editor.previousSection!)}
          saved={editor.saved === "content"}
        />
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <RichTextEditor value={editor.content} onChange={editor.setContent} />
      </div>
    </SectionCard>
  );
}
