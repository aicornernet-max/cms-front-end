import { Plus, X } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SectionCard, Footer, FaqRow, EmptyState, Field, Textarea, buttonPrimary, buttonSecondary } from "../shared";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function FaqSection({ editor }: { editor: SeoPageEditor }) {
  return (
    <>
      <SectionCard
        title="FAQs"
        eyebrow="06"
        description="Build helpful questions and answers. Reorder them exactly as they should appear on the website."
        footer={
          <Footer
            saveLabel="Save FAQs"
            onSave={() => editor.save("faq")}
            saving={editor.saving}
            next={editor.nextSection}
            onNext={() => editor.save("faq", editor.nextSection)}
            previous={editor.previousSection}
            onPrevious={() => editor.setActive(editor.previousSection!)}
            saved={editor.saved === "faq"}
          />
        }
      >
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <div>
            <p className="text-sm font-bold text-indigo-950">FAQ collection</p>
            <p className="text-xs text-indigo-700">
              {editor.faqs.length
                ? `${editor.faqs.length} question${editor.faqs.length === 1 ? "" : "s"} added`
                : "No questions yet"}
            </p>
          </div>
          <button onClick={() => editor.setFaqOpen(true)} className={buttonPrimary}>
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        </div>

        {editor.faqs.length === 0 ? (
          <EmptyState
            title="Start with your first FAQ"
            text="Add a question and answer. You can reorder FAQs later with drag and drop."
            action="Add FAQ"
            onAction={() => editor.setFaqOpen(true)}
          />
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={editor.onFaqDrag}>
            <SortableContext
              items={editor.faqs.map((f) => f.clientId ?? f._id!)}
              strategy={verticalListSortingStrategy}
            >
              {editor.faqs.map((faq, index) => {
                const key = faq.clientId ?? faq._id!;
                return (
                  <FaqRow
                    key={key}
                    id={key}
                    index={index}
                    item={faq}
                    onChange={editor.updateFaq}
                    onRemove={() => editor.removeFaq(key)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </SectionCard>

      {editor.faqOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add FAQ</h3>
                <p className="text-sm text-slate-500">
                  Write the question and answer that users will see.
                </p>
              </div>
              <button onClick={() => editor.setFaqOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <Field
                label="Question"
                required
                value={editor.faqQuestion}
                onChange={editor.setFaqQuestion}
                placeholder="What is this page about?"
              />
              <Textarea
                label="Answer"
                value={editor.faqAnswer}
                onChange={editor.setFaqAnswer}
                placeholder="Write a clear, helpful answer."
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => editor.setFaqOpen(false)} className={buttonSecondary}>
                Cancel
              </button>
              <button
                onClick={editor.addFaq}
                disabled={!editor.faqQuestion.trim() || !editor.faqAnswer.trim()}
                className={buttonPrimary}
              >
                <Plus className="h-4 w-4" /> Add FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
