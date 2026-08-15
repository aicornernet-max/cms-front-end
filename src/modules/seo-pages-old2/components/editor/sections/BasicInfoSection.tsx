import { Field, Textarea, Label, SlugField, SectionCard, Footer, ImageDropzone, input } from "../shared";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function BasicInfoSection({ editor }: { editor: SeoPageEditor }) {
  const { mode, nextSection } = editor;

  return (
    <SectionCard
      title="Basic information"
      eyebrow="01"
      description="Start with the page identity. You can finish the remaining sections later."
      footer={
        <Footer
          saveLabel={mode === "create" ? "Create draft & continue" : "Save basic information"}
          onSave={mode === "create" ? editor.create : () => editor.save("basic")}
          saving={editor.saving}
          next={mode === "edit" ? nextSection : undefined}
          onNext={mode === "edit" && nextSection ? () => editor.save("basic", nextSection) : undefined}
          saved={editor.saved === "basic"}
        />
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Page title"
          required
          value={editor.title}
          onChange={editor.onTitleChange}
          placeholder="e.g. Best AI Tools for Developers"
        />
        <SlugField
          value={editor.slug}
          onChange={editor.onSlugChange}
          onRegenerate={editor.regenerateSlugFromTitle}
        />
        <label className="md:col-span-2">
          <Label text="Category" required />
          <select
            className={input}
            value={editor.categoryId}
            onChange={(e) => editor.setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {editor.categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <Textarea
          label="Page description"
          value={editor.pageDescription}
          onChange={editor.setPageDescription}
          placeholder="Short description used to explain this page."
        />
        <Textarea
          label="Category description"
          value={editor.categoryDescription}
          onChange={editor.setCategoryDescription}
          placeholder="Optional category context for this page."
        />
      </div>
      <div className="mt-6">
        <ImageDropzone
          preview={editor.imagePreview}
          onFile={editor.imageChange}
          onRemove={editor.removeCategoryImage}
        />
      </div>
    </SectionCard>
  );
}
