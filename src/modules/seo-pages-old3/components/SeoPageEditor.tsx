import { useEffect, useMemo, useState } from "react";
import { Check, GripVertical, Plus, Trash2, UserRound, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { seoPageV2Service } from "../services/seoPageV2.service";
import type {
  AuthorProfile,
  Category,
  PageFaq,
  PageStatus,
  PageTool,
  SeoPage,
  Tool,
} from "../types/seoPageV2.types";

type SectionKey = "basic" | "seo" | "authors" | "content" | "tools" | "faq" | "publish";

const sections: Array<{ key: SectionKey; label: string }> = [
  { key: "basic", label: "Basic Information" },
  { key: "seo", label: "SEO & Meta" },
  { key: "authors", label: "Author & Review" },
  { key: "content", label: "Content" },
  { key: "tools", label: "Tools" },
  { key: "faq", label: "FAQs" },
  { key: "publish", label: "Publish & Status" },
];

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function idOf(value: string | { _id: string } | null | undefined) {
  return typeof value === "string" ? value : value?._id ?? "";
}

function SortableTool({
  item,
  onChange,
  onRemove,
}: {
  item: PageTool;
  onChange: (next: PageTool) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: idOf(item.toolId) });

  const tool = typeof item.toolId === "string" ? undefined : item.toolId;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab text-slate-400"
          aria-label="Drag tool"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {tool?.images?.tool?.url ? (
                <img
                  src={tool.images.tool.url}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  AI
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900">{tool?.name ?? "Selected tool"}</p>
                {tool?.brand ? <p className="text-xs text-slate-500">{tool.brand}</p> : null}
              </div>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove tool"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <textarea
            value={item.customDescription}
            onChange={(e) => onChange({ ...item, customDescription: e.target.value })}
            rows={2}
            placeholder="Custom description for this page"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}

export default function SeoPageEditor({
  pageId,
  mode,
}: {
  pageId?: string;
  mode: "create" | "edit";
}) {
  const [active, setActive] = useState<SectionKey>("basic");
  const [page, setPage] = useState<SeoPage | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(Boolean(pageId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [writtenBy, setWrittenBy] = useState<AuthorProfile | null>(null);
  const [reviewedBy, setReviewedBy] = useState<AuthorProfile | null>(null);
  const [authorQuery, setAuthorQuery] = useState("");
  const [authorResults, setAuthorResults] = useState<AuthorProfile[]>([]);
  const [content, setContent] = useState("");
  const [tools, setTools] = useState<PageTool[]>([]);
  const [toolQuery, setToolQuery] = useState("");
  const [toolResults, setToolResults] = useState<Tool[]>([]);
  const [faq, setFaq] = useState<PageFaq[]>([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  const readPage = (value: SeoPage) => {
    setPage(value);
    setTitle(value.title ?? "");
    setSlug(value.slug ?? "");
    setCategoryId(idOf(value.categoryId));
    setPageDescription(value.pageDescription ?? "");
    setCategoryDescription(value.categoryDescription ?? "");
    setSeoTitle(value.meta?.title ?? "");
    setSeoDescription(value.meta?.description ?? "");
    setSeoKeywords(value.meta?.keywords?.join(", ") ?? "");
    setWrittenBy(typeof value.writtenBy === "object" ? value.writtenBy : null);
    setReviewedBy(typeof value.reviewedBy === "object" ? value.reviewedBy : null);
    setContent(value.content ?? "");
    setTools(value.tools ?? []);
    setFaq(value.faq ?? []);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const categoryResponse = await seoPageV2Service.getCategories();
        if (mounted) setCategories(categoryResponse.data ?? []);

        if (pageId) {
          const response = await seoPageV2Service.get(pageId);
          if (mounted) readPage(response.data);
        }
      } catch {
        if (mounted) setMessage("Unable to load page data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pageId]);

  const status: PageStatus = page?.status ?? "draft";
  const editable = status !== "published";

  const selectedCategory = useMemo(
    () => categories.find((item) => item._id === categoryId),
    [categories, categoryId],
  );

  const saveBasic = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateBasic(pageId, {
        title,
        slug,
        categoryId,
        pageDescription,
        categoryDescription,
      });
      readPage(response.data);
      setMessage("Basic information saved.");
    } catch {
      setMessage("Unable to save basic information.");
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateSeo(pageId, {
        meta: {
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywords.split(",").map((x) => x.trim()).filter(Boolean),
        },
      });
      readPage(response.data);
      setMessage("SEO saved.");
    } catch {
      setMessage("Unable to save SEO.");
    } finally {
      setSaving(false);
    }
  };

  const saveAuthors = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateAuthors(pageId, {
        writtenBy: writtenBy?._id ?? null,
        reviewedBy: reviewedBy?._id ?? null,
      });
      readPage(response.data);
      setMessage("Author and reviewer saved.");
    } catch {
      setMessage("Unable to save authors.");
    } finally {
      setSaving(false);
    }
  };

  const saveContent = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateContent(pageId, { content });
      readPage(response.data);
      setMessage("Content saved.");
    } catch {
      setMessage("Unable to save content.");
    } finally {
      setSaving(false);
    }
  };

  const saveTools = async (next = tools) => {
    if (!pageId) return;
    const normalized = next.map((item, index) => ({ ...item, position: index + 1 }));
    setTools(normalized);
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateTools(pageId, { tools: normalized });
      readPage(response.data);
      setMessage("Tools saved.");
    } catch {
      setMessage("Unable to save tools.");
    } finally {
      setSaving(false);
    }
  };

  const saveFaqs = async (next = faq) => {
    if (!pageId) return;
    const normalized = next.map((item, index) => ({ ...item, position: index + 1 }));
    setFaq(normalized);
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateFaqs(pageId, { faq: normalized });
      readPage(response.data);
      setMessage("FAQs saved.");
    } catch {
      setMessage("Unable to save FAQs.");
    } finally {
      setSaving(false);
    }
  };

  const create = async () => {
    if (!title.trim() || !slug.trim() || !categoryId) {
      setMessage("Title, slug and category are required.");
      setActive("basic");
      return;
    }

    setSaving(true);
    try {
      const response = await seoPageV2Service.create({
        title: title.trim(),
        slug: slug.trim(),
        categoryId,
      });
      window.location.assign(`/pages/edit/${response.data._id}`);
    } catch {
      setMessage("Unable to create draft.");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      const response = await seoPageV2Service.updateStatus(pageId, "published");
      readPage(response.data);
      setMessage("Page published successfully.");
    } catch {
      setMessage("Publish failed. Please complete the required sections.");
    } finally {
      setSaving(false);
    }
  };

  const searchAuthors = async () => {
    if (!authorQuery.trim()) return;
    try {
      const response = await seoPageV2Service.searchAuthors(authorQuery);
      setAuthorResults(response.data ?? []);
    } catch {
      setMessage("Unable to search authors.");
    }
  };

  const searchTools = async () => {
    if (!toolQuery.trim()) return;
    try {
      const response = await seoPageV2Service.searchTools(toolQuery);
      setToolResults(response.data ?? []);
    } catch {
      setMessage("Unable to search tools.");
    }
  };

  const addTool = (tool: Tool) => {
    if (tools.some((item) => idOf(item.toolId) === tool._id)) return;
    setTools((current) => [
      ...current,
      { toolId: tool, customDescription: "", position: current.length + 1 },
    ]);
    setToolQuery("");
    setToolResults([]);
  };

  const addFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setFaq((current) => [
      ...current,
      {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        position: current.length + 1,
      },
    ]);
    setFaqQuestion("");
    setFaqAnswer("");
  };

  const onToolDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return;
    const oldIndex = tools.findIndex((item) => idOf(item.toolId) === event.active.id);
    const newIndex = tools.findIndex((item) => idOf(item.toolId) === event.over?.id);
    if (oldIndex < 0 || newIndex < 0) return;
    saveTools(arrayMove(tools, oldIndex, newIndex));
  };

  const onFaqDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return;
    const oldIndex = faq.findIndex((item) => item._id === event.active.id);
    const newIndex = faq.findIndex((item) => item._id === event.over?.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setFaq(arrayMove(faq, oldIndex, newIndex));
  };

  const addFaqAndSave = async () => {
    const next = [
      ...faq,
      {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        position: faq.length + 1,
      },
    ];
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setFaqQuestion("");
    setFaqAnswer("");
    await saveFaqs(next);
  };

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center text-sm text-slate-500">Loading SEO page…</div>;
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">SEO Management · V2</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {mode === "create" ? "Create SEO Page" : title || "Edit SEO Page"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {status === "published" ? "Published content is read-only." : "Edit each section independently."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
              {status}
            </span>
            {mode === "create" ? (
              <button
                type="button"
                onClick={create}
                disabled={saving}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Creating…" : "Create Draft"}
              </button>
            ) : (
              <button
                type="button"
                onClick={publish}
                disabled={saving || !editable}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Publishing…" : "Publish"}
              </button>
            )}
          </div>
        </header>

        {message ? (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:sticky lg:top-6">
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActive(section.key)}
                className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  active === section.key
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{section.label}</span>
                {section.key !== "publish" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                )}
              </button>
            ))}
          </aside>

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {active === "basic" && (
              <div className="space-y-5">
                <SectionTitle title="Basic Information" description="Core page identity and category." />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Title" value={title} onChange={setTitle} />
                  <Field label="Slug" value={slug} onChange={setSlug} />
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Category</span>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                      ))}
                    </select>
                    {selectedCategory ? <span className="mt-1 block text-xs text-slate-400">{selectedCategory.slug}</span> : null}
                  </label>
                  <Textarea label="Page Description" value={pageDescription} onChange={setPageDescription} />
                  <Textarea label="Category Description" value={categoryDescription} onChange={setCategoryDescription} />
                </div>
                {mode === "create" ? (
                  <button onClick={create} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
                    {saving ? "Creating…" : "Create Draft & Continue"}
                  </button>
                ) : (
                  <SaveButton onClick={saveBasic} saving={saving} />
                )}
              </div>
            )}

            {active === "seo" && (
              <div className="space-y-5">
                <SectionTitle title="SEO & Meta" description="Search-engine metadata for this page." />
                <Field label="Meta Title" value={seoTitle} onChange={setSeoTitle} />
                <Textarea label="Meta Description" value={seoDescription} onChange={setSeoDescription} />
                <Field label="Keywords" value={seoKeywords} onChange={setSeoKeywords} placeholder="ai tools, developer tools, automation" />
                <SaveButton onClick={saveSeo} saving={saving} />
              </div>
            )}

            {active === "authors" && (
              <div className="space-y-6">
                <SectionTitle title="Author & Review" description="Select the author and reviewer profiles." />
                <AuthorPicker label="Written by" value={writtenBy} onSelect={setWrittenBy} onRemove={() => setWrittenBy(null)} />
                <AuthorPicker label="Reviewed by" value={reviewedBy} onSelect={setReviewedBy} onRemove={() => setReviewedBy(null)} />
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex gap-2">
                    <input value={authorQuery} onChange={(e) => setAuthorQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchAuthors()} placeholder="Search author…" className={inputClass.replace("mt-1 ", "")} />
                    <button onClick={searchAuthors} className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Search</button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {authorResults.map((author) => (
                      <button key={author._id} onClick={() => { setWrittenBy(author); setAuthorResults([]); }} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                        {author.profileImage ? <img src={author.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" /> : <UserRound className="h-9 w-9 rounded-full bg-slate-100 p-2 text-slate-500" />}
                        <span><strong className="block text-sm text-slate-800">{author.name}</strong><small className="text-xs text-slate-500">{author.email}</small></span>
                      </button>
                    ))}
                  </div>
                </div>
                <SaveButton onClick={saveAuthors} saving={saving} />
              </div>
            )}

            {active === "content" && (
              <div className="space-y-5">
                <SectionTitle title="Content" description="Use the existing rich-text editor in the host application here." />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className={`${inputClass} font-mono`}
                  placeholder="Replace this textarea with the existing TipTap/React Quill editor from the project."
                />
                <SaveButton onClick={saveContent} saving={saving} />
              </div>
            )}

            {active === "tools" && (
              <div className="space-y-5">
                <SectionTitle title="Tools" description="Search, add, edit descriptions and drag to reorder." />
                <div className="flex gap-2">
                  <input value={toolQuery} onChange={(e) => setToolQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchTools()} placeholder="Search tools…" className={inputClass.replace("mt-1 ", "")} />
                  <button onClick={searchTools} className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Search</button>
                </div>
                <div className="space-y-2">
                  {toolResults.map((tool) => (
                    <button key={tool._id} onClick={() => addTool(tool)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-xs font-bold">AI</span>
                      <span className="font-semibold text-sm">{tool.name}</span>
                      <Plus className="ml-auto h-4 w-4" />
                    </button>
                  ))}
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={onToolDragEnd}>
                  <SortableContext items={tools.map((x) => idOf(x.toolId))} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {tools.map((tool) => (
                        <SortableTool
                          key={idOf(tool.toolId)}
                          item={tool}
                          onChange={(next) => setTools((current) => current.map((x) => idOf(x.toolId) === idOf(tool.toolId) ? next : x))}
                          onRemove={() => saveTools(tools.filter((x) => idOf(x.toolId) !== idOf(tool.toolId)))}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <SaveButton onClick={() => saveTools()} saving={saving} />
              </div>
            )}

            {active === "faq" && (
              <div className="space-y-5">
                <SectionTitle title="FAQs" description="Add FAQs and drag them into the required display order." />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <input value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} placeholder="Question" className={inputClass.replace("mt-1 ", "")} />
                  <textarea value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} placeholder="Answer" rows={3} className={`${inputClass} resize-none`} />
                  <button onClick={addFaqAndSave} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                    <Plus className="h-4 w-4" /> Add FAQ
                  </button>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={onFaqDragEnd}>
                  <SortableContext items={faq.map((x, i) => x._id ?? `faq-${i}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {faq.map((item, index) => (
                        <FaqRow
                          key={item._id ?? `faq-${index}`}
                          id={item._id ?? `faq-${index}`}
                          item={item}
                          onChange={(next) => setFaq((current) => current.map((x, i) => i === index ? next : x))}
                          onRemove={() => saveFaqs(faq.filter((_, i) => i !== index))}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <SaveButton onClick={() => saveFaqs()} saving={saving} />
              </div>
            )}

            {active === "publish" && (
              <div className="space-y-5">
                <SectionTitle title="Publish & Status" description="Publishing performs complete backend validation." />
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-sm text-slate-600">Current status</p>
                  <p className="mt-1 text-2xl font-bold capitalize text-slate-900">{status}</p>
                  {page?.parentId ? (
                    <p className="mt-2 text-xs text-slate-500">This is a draft copy of a published page.</p>
                  ) : null}
                </div>
                <button onClick={publish} disabled={saving || !editable} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
                  {saving ? "Publishing…" : "Publish Page"}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
    </label>
  );
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button onClick={onClick} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
      <Check className="h-4 w-4" />
      {saving ? "Saving…" : "Save Section"}
    </button>
  );
}

function AuthorPicker({
  label,
  value,
  onSelect,
  onRemove,
}: {
  label: string;
  value: AuthorProfile | null;
  onSelect: (value: AuthorProfile) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-700">{label}</div>
      {value ? (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            {value.profileImage ? <img src={value.profileImage} alt="" className="h-11 w-11 rounded-full object-cover" /> : <UserRound className="h-11 w-11 rounded-full bg-slate-100 p-3 text-slate-500" />}
            <div>
              <p className="font-semibold text-slate-900">{value.name}</p>
              <p className="text-xs text-slate-500">{value.email}</p>
            </div>
          </div>
          <button onClick={onRemove} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">No {label.toLowerCase()} selected.</div>
      )}
    </div>
  );
}

function FaqRow({
  id,
  item,
  onChange,
  onRemove,
}: {
  id: string;
  item: PageFaq;
  onChange: (next: PageFaq) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex gap-3">
        <button type="button" {...attributes} {...listeners} className="mt-1 cursor-grab text-slate-400"><GripVertical className="h-5 w-5" /></button>
        <div className="min-w-0 flex-1">
          <input value={item.question} onChange={(e) => onChange({ ...item, question: e.target.value })} className={inputClass.replace("mt-1 ", "")} placeholder="Question" />
          <textarea value={item.answer} onChange={(e) => onChange({ ...item, answer: e.target.value })} rows={3} className={`${inputClass} resize-none`} placeholder="Answer" />
        </div>
        <button type="button" onClick={onRemove} className="h-fit rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
