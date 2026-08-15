import { Loader2, Send } from "lucide-react";
import { SectionCard, ReviewItem, buttonPrimary } from "../shared";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function PublishSection({ editor }: { editor: SeoPageEditor }) {
  return (
    <SectionCard
      title="Review & publish"
      eyebrow="07"
      description="Your backend performs the final complete validation when you publish."
      footer={null}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewItem label="Basic information" done={editor.completion.basic} />
        <ReviewItem label="SEO & meta" done={editor.completion.seo} />
        <ReviewItem label="Author / reviewer" done={editor.completion.authors} />
        <ReviewItem label="Content" done={editor.completion.content} />
        <ReviewItem label="Tools" done={editor.completion.tools} />
        <ReviewItem label="FAQs" done={editor.completion.faq} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <Send className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-bold">Ready to publish?</p>
            <p className="mt-1 text-sm text-slate-500">
              Publishing validates the complete page. If validation fails, the page remains a
              draft and the backend error will appear here.
            </p>
          </div>
        </div>
        <button
          onClick={editor.publish}
          disabled={editor.saving || !editor.editable}
          className={`${buttonPrimary} mt-5`}
        >
          {editor.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Publish page
        </button>
      </div>
    </SectionCard>
  );
}
