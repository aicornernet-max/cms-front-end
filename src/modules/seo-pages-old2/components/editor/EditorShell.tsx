import { ChevronRight, Check, Eye, Loader2, Plus, Send, X } from "lucide-react";
import { useSeoPageEditor, editorSections } from "../../hooks/useSeoPageEditor";
import { buttonPrimary, buttonSecondary } from "./shared";
import { DraftGate } from "./DraftGate";
import {
  BasicInfoSection,
  SeoSection,
  AuthorsSection,
  ContentSection,
  ToolsSection,
  FaqSection,
  PublishSection,
} from "./sections";
import type { SeoPageEditorProps } from "../../types";

const sectionComponents = {
  basic: BasicInfoSection,
  seo: SeoSection,
  authors: AuthorsSection,
  content: ContentSection,
  tools: ToolsSection,
  faq: FaqSection,
  publish: PublishSection,
};

export default function EditorShell({ mode, pageId, onSaved, onPreview }: SeoPageEditorProps) {
  const editor = useSeoPageEditor({
    mode,
    pageId,
    onCreated: onSaved,
  });

  if (editor.loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading page editor…
        </div>
      </div>
    );
  }

  const ActiveSection = sectionComponents[editor.active];
  const completedCount = Object.values(editor.completion).filter(Boolean).length;

  const handlePreview = () => {
    if (!editor.page?.slug) return;
    if (onPreview) onPreview(editor.page.slug);
    else window.open(`/preview/${editor.page.slug}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 mb-5 border-b border-slate-200/80 bg-[#f6f7fb]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <span>SEO PAGES</span>
                <span className="text-slate-300">/</span>
                <span>{mode === "create" ? "NEW PAGE" : "EDITOR"}</span>
              </div>
              <h1 className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">
                {mode === "create" ? "Create SEO page" : editor.title || "Edit SEO page"}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {editor.isPublishedReadOnly
                  ? "Published version · read-only until you create a draft"
                  : "Build your page section by section. Changes stay in draft until you publish."}
              </p>
            </div>

            {!editor.isPublishedReadOnly && (
              <div className="flex shrink-0 items-center gap-2">
                {editor.page?.slug && (
                  <button type="button" onClick={handlePreview} className={buttonSecondary}>
                    <Eye className="h-4 w-4" /> <span className="hidden sm:inline">Preview</span>
                  </button>
                )}
                {mode === "create" ? (
                  <button onClick={editor.create} disabled={editor.saving} className={buttonPrimary}>
                    {editor.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Create draft
                  </button>
                ) : (
                  <button onClick={editor.publish} disabled={editor.saving} className={buttonPrimary}>
                    {editor.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Publish
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {editor.error && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{editor.error}</span>
            <button onClick={() => editor.setError("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {editor.isPublishedReadOnly ? (
          <DraftGate
            title={editor.title}
            creatingDraft={editor.creatingDraft}
            onStartDraft={editor.startEditingDraft}
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:sticky lg:top-[100px]">
              <div className="px-3 pb-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Page setup
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {completedCount}/{editorSections.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${(completedCount / editorSections.length) * 100}%` }}
                  />
                </div>
              </div>
              {editorSections.map((section, index) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => editor.setActive(section.key)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    editor.active === section.key
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                      editor.completion[section.key]
                        ? "bg-emerald-50 text-emerald-600"
                        : editor.active === section.key
                          ? "bg-white text-indigo-600"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {editor.completion[section.key] ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm">{section.title}</strong>
                    <small className="block truncate text-xs text-slate-400">{section.short}</small>
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition ${
                      editor.active === section.key
                        ? "translate-x-0 text-indigo-400"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              ))}
            </aside>

            <section className="min-w-0">
              <ActiveSection editor={editor} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
