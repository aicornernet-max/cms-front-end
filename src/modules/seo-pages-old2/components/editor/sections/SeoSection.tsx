import { Field, Textarea, SectionCard, Footer } from "../shared";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function SeoSection({ editor }: { editor: SeoPageEditor }) {
  return (
    <SectionCard
      title="SEO & meta"
      eyebrow="02"
      description="Control how the page appears in search engines."
      footer={
        <Footer
          saveLabel="Save SEO"
          onSave={() => editor.save("seo")}
          saving={editor.saving}
          next={editor.nextSection}
          onNext={() => editor.save("seo", editor.nextSection)}
          previous={editor.previousSection}
          onPrevious={() => editor.setActive(editor.previousSection!)}
          saved={editor.saved === "seo"}
        />
      }
    >
      <div className="space-y-5">
        <Field
          label="Meta title"
          value={editor.seoTitle}
          onChange={editor.setSeoTitle}
          placeholder="Search result title"
          hint={`${editor.seoTitle.length}/60 characters`}
        />
        <Textarea
          label="Meta description"
          value={editor.seoDescription}
          onChange={editor.setSeoDescription}
          placeholder="Write a concise description for search results."
          hint={`${editor.seoDescription.length}/160 characters`}
        />
        <Field
          label="Keywords"
          value={editor.keywords}
          onChange={editor.setKeywords}
          placeholder="ai tools, developer tools, automation"
          hint="Separate keywords with commas."
        />
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Search preview
          </p>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-lg font-medium text-blue-700">
              {editor.seoTitle || editor.title || "Your page title"}
            </div>
            <div className="mt-1 text-xs text-emerald-700">
              aicorner.net/{editor.slug || "your-page-slug"}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
              {editor.seoDescription || editor.pageDescription || "Your meta description will appear here."}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
