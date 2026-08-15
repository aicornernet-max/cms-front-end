import { useEffect, useMemo, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { pageEditorService } from "../services/pageEditor.service";
import { slugify } from "../utils/slug";
import type {
  AuthorProfile,
  Category,
  EditorSection,
  PageFaq,
  PageTool,
  SeoPage,
  Tool,
} from "../types";

export const editorSections: Array<{
  key: EditorSection;
  title: string;
  short: string;
}> = [
  { key: "basic", title: "Basic information", short: "Identity & category" },
  { key: "seo", title: "SEO & meta", short: "Search visibility" },
  { key: "authors", title: "Author & reviewer", short: "Editorial ownership" },
  { key: "content", title: "Content", short: "Rich text" },
  { key: "tools", title: "Tools", short: "Directory ordering" },
  { key: "faq", title: "FAQs", short: "Questions & answers" },
  { key: "publish", title: "Review & publish", short: "Final validation" },
];

const idOf = (value: string | { _id: string } | null | undefined) =>
  typeof value === "string" ? value : (value?._id ?? "");

const normalizeTool = (tool: any, index: number): PageTool => {
  const rawTool =
    typeof tool.toolId === "object" && tool.toolId !== null
      ? tool.toolId
      : null;
  const toolId = String(tool.toolId ?? rawTool?._id ?? rawTool?.id ?? tool.id ?? "");
  const rawImage =
    tool.image ?? rawTool?.image ?? rawTool?.images?.tool ?? tool.images?.tool;
  const image = typeof rawImage === "string" ? { url: rawImage } : rawImage;

  return {
    toolId,
    name: tool.name ?? rawTool?.name,
    brand: tool.brand ?? rawTool?.brand,
    image,
    customDescription: tool.customDescription ?? "",
    position: index + 1,
  };
};

const normalizeTools = (items: PageTool[] = []) =>
  items.map((item, index) => normalizeTool(item, index));

const normalizeFaqs = (items: PageFaq[] = []) =>
  items.map((item, index) => ({
    ...item,
    clientId: item.clientId ?? item._id ?? `faq-${Date.now()}-${index}`,
    position: index + 1,
  }));

export interface UseSeoPageEditorArgs {
  mode: "create" | "edit";
  pageId?: string;
  onCreated?: (newPageId: string) => void;
}

export function useSeoPageEditor({ mode, pageId, onCreated }: UseSeoPageEditorArgs) {
  const [active, setActive] = useState<EditorSection>("basic");
  const [page, setPage] = useState<SeoPage | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(Boolean(pageId));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<EditorSection | null>(null);
  const [error, setError] = useState("");

  // The id we actually read/write against. Starts as the route id, but
  // moves to a fresh draft's id once one is created from a published page.
  const [workingId, setWorkingId] = useState(pageId);
  const [creatingDraft, setCreatingDraft] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const [writtenBy, setWrittenBy] = useState<AuthorProfile | null>(null);
  const [reviewedBy, setReviewedBy] = useState<AuthorProfile | null>(null);
  const [authorTarget, setAuthorTarget] = useState<"writtenBy" | "reviewedBy">(
    "writtenBy",
  );
  const [authorQuery, setAuthorQuery] = useState("");
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);

  const [content, setContent] = useState("");

  const [tools, setTools] = useState<PageTool[]>([]);
  const [toolQuery, setToolQuery] = useState("");
  const [toolResults, setToolResults] = useState<Tool[]>([]);

  const [faqs, setFaqs] = useState<PageFaq[]>([]);
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  // A page is locked for editing only while it is published AND we haven't
  // switched onto an editable draft of it yet.
  const isPublishedReadOnly = page?.status === "published";
  const editable = !isPublishedReadOnly;

  const currentIndex = editorSections.findIndex((section) => section.key === active);
  const nextSection = editorSections[currentIndex + 1]?.key;
  const previousSection = editorSections[currentIndex - 1]?.key;

  const completion = useMemo(
    () => ({
      basic: Boolean(title.trim() && slug.trim() && categoryId),
      seo: Boolean(seoTitle.trim() || seoDescription.trim()),
      authors: Boolean(writtenBy || reviewedBy),
      content: Boolean(content.replace(/<[^>]*>/g, "").trim()),
      tools: tools.length > 0,
      faq: faqs.length > 0,
      publish: page?.status === "published",
    }),
    [
      title,
      slug,
      categoryId,
      seoTitle,
      seoDescription,
      writtenBy,
      reviewedBy,
      content,
      tools.length,
      faqs.length,
      page?.status,
    ],
  );

  const readPage = (data: SeoPage) => {
    setPage(data);
    setTitle(data.title ?? "");
    setSlug(data.slug ?? "");
    setSlugTouched(true); // an existing page's slug is never auto-overwritten
    setCategoryId(idOf(data.categoryId));
    setPageDescription(data.pageDescription ?? "");
    setCategoryDescription(data.categoryDescription ?? "");
    setSeoTitle(data.meta?.title ?? "");
    setSeoDescription(data.meta?.description ?? "");
    setKeywords(data.meta?.keywords?.join(", ") ?? "");
    setWrittenBy(typeof data.writtenBy === "object" ? data.writtenBy : null);
    setReviewedBy(typeof data.reviewedBy === "object" ? data.reviewedBy : null);
    setContent(data.content ?? "");
    setTools(normalizeTools(data.tools));
    setFaqs(normalizeFaqs(data.faq));
    setImagePreview(data.catImage?.url ?? "");
    setImageFile(null);
    setRemoveImage(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const categoriesResponse = await pageEditorService.getCategories();
        setCategories(categoriesResponse.data ?? []);

        if (pageId) {
          const loaded = (await pageEditorService.get(pageId)).data;
          readPage(loaded);
          setWorkingId(pageId);
        }
      } catch {
        setError("We couldn't load this page. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  const flashSaved = (section: EditorSection) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2200);
  };

  const handleError = (err: any, fallback: string) => {
    const errors = err?.response?.data?.errors;
    setError(errors?.[0]?.message || err?.response?.data?.message || fallback);
  };

  // Explicit gate: a published page stays read-only until the user asks
  // to edit it, at which point we fetch/create its linked draft and start
  // working against that draft's id instead.
  const startEditingDraft = async () => {
    if (!workingId) return;
    setCreatingDraft(true);
    setError("");
    try {
      const draft = (await pageEditorService.createOrGetDraft(workingId)).data;
      readPage(draft);
      setWorkingId(draft._id);
    } catch (err) {
      handleError(err, "Couldn't create an editable draft. Please try again.");
    } finally {
      setCreatingDraft(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setSlug(value);
  };

  const regenerateSlugFromTitle = () => {
    setSlug(slugify(title));
    setSlugTouched(false);
  };

  const save = async (section: EditorSection, next?: EditorSection) => {
    if (!workingId || !editable) return;
    setSaving(true);
    setError("");

    try {
      let response;

      if (section === "basic") {
        response = await pageEditorService.updateBasic(
          workingId,
          {
            title,
            slug,
            categoryId,
            pageDescription,
            categoryDescription,
          },
          imageFile,
          removeImage,
        );
      }
      if (section === "seo") {
        response = await pageEditorService.updateSeo(workingId, {
          meta: {
            title: seoTitle,
            description: seoDescription,
            keywords: keywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean),
          },
        });
      }
      if (section === "authors") {
        response = await pageEditorService.updateAuthors(workingId, {
          writtenBy: writtenBy?._id ?? null,
          reviewedBy: reviewedBy?._id ?? null,
        });
      }
      if (section === "content") {
        response = await pageEditorService.updateContent(workingId, { content });
      }
      if (section === "tools") {
        response = await pageEditorService.updateTools(workingId, {
          tools: normalizeTools(tools),
        });
      }
      if (section === "faq") {
        const faqPayload = normalizeFaqs(faqs).map(
          ({ clientId, _id, ...faq }) => faq,
        );
        response = await pageEditorService.updateFaqs(workingId, {
          faq: faqPayload,
        });
      }

      if (response) readPage(response.data);
      flashSaved(section);
      if (next) setActive(next);
    } catch (err) {
      const label = editorSections.find((s) => s.key === section)?.title.toLowerCase();
      handleError(err, `Couldn't save ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  const create = async () => {
    if (!title.trim() || !slug.trim() || !categoryId) {
      setError("Add a title, slug and category to create the draft.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await pageEditorService.create({
        title: title.trim(),
        slug: slug.trim(),
        categoryId,
      });
      onCreated?.(response.data._id);
    } catch (err) {
      handleError(err, "Couldn't create the draft.");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!workingId) return;
    setSaving(true);
    setError("");
    try {
      const response = await pageEditorService.updateStatus(workingId, "published");
      readPage(response.data);
      flashSaved("publish");
    } catch (err) {
      handleError(err, "Publishing failed. Complete the required sections and try again.");
    } finally {
      setSaving(false);
    }
  };

  const searchAuthors = async () => {
    if (!authorQuery.trim()) return;
    try {
      setAuthors((await pageEditorService.searchAuthors(authorQuery)).data ?? []);
    } catch (err) {
      handleError(err, "Author search failed.");
    }
  };

  const searchTools = async () => {
    if (!toolQuery.trim()) return;
    try {
      setToolResults((await pageEditorService.searchTools(toolQuery)).data ?? []);
    } catch (err) {
      handleError(err, "Tool search failed.");
    }
  };

  const addTool = (tool: Tool) => {
    const toolId = String(tool._id ?? "");
    if (!toolId || tools.some((item) => item.toolId === toolId)) return;

    setTools((current) => [
      ...current,
      {
        toolId,
        name: tool.name,
        brand: tool.brand,
        image: tool.image ?? tool.images?.tool,
        customDescription: "",
        position: current.length + 1,
      },
    ]);
    setToolResults([]);
    setToolQuery("");
  };

  const updateTool = (next: PageTool) =>
    setTools((current) =>
      current.map((item) => (idOf(item.toolId) === idOf(next.toolId) ? next : item)),
    );

  const removeTool = (toolId: string) =>
    setTools((current) => current.filter((item) => idOf(item.toolId) !== idOf(toolId)));

  const onToolDrag = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return;
    const from = tools.findIndex((item) => idOf(item.toolId) === event.active.id);
    const to = tools.findIndex((item) => idOf(item.toolId) === event.over?.id);
    if (from >= 0 && to >= 0) setTools(normalizeTools(arrayMove(tools, from, to)));
  };

  const addFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setFaqs((current) =>
      normalizeFaqs([
        ...current,
        {
          clientId: `faq-${Date.now()}`,
          question: faqQuestion.trim(),
          answer: faqAnswer.trim(),
          position: current.length + 1,
        },
      ]),
    );
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqOpen(false);
  };

  const updateFaq = (next: PageFaq) =>
    setFaqs((current) =>
      current.map((item) =>
        (item.clientId ?? item._id) === (next.clientId ?? next._id) ? next : item,
      ),
    );

  const removeFaq = (key: string) =>
    setFaqs((current) => current.filter((item) => (item.clientId ?? item._id) !== key));

  const onFaqDrag = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return;
    const from = faqs.findIndex((item) => (item.clientId ?? item._id) === event.active.id);
    const to = faqs.findIndex((item) => (item.clientId ?? item._id) === event.over?.id);
    if (from >= 0 && to >= 0) setFaqs(normalizeFaqs(arrayMove(faqs, from, to)));
  };

  const selectAuthor = (author: AuthorProfile) => {
    if (authorTarget === "writtenBy") setWrittenBy(author);
    else setReviewedBy(author);
    setAuthors([]);
    setAuthorQuery("");
  };

  const imageChange = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeCategoryImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(true);
  };

  return {
    mode,
    active,
    setActive,
    page,
    categories,
    loading,
    saving,
    saved,
    error,
    setError,
    isPublishedReadOnly,
    editable,
    creatingDraft,
    startEditingDraft,
    currentIndex,
    nextSection,
    previousSection,
    completion,

    title,
    onTitleChange: handleTitleChange,
    slug,
    onSlugChange: handleSlugChange,
    regenerateSlugFromTitle,
    categoryId,
    setCategoryId,
    pageDescription,
    setPageDescription,
    categoryDescription,
    setCategoryDescription,
    imageFile,
    imagePreview,
    removeImage,
    imageChange,
    removeCategoryImage,

    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    keywords,
    setKeywords,

    writtenBy,
    reviewedBy,
    authorTarget,
    setAuthorTarget,
    authorQuery,
    setAuthorQuery,
    authors,
    searchAuthors,
    selectAuthor,
    clearWrittenBy: () => setWrittenBy(null),
    clearReviewedBy: () => setReviewedBy(null),

    content,
    setContent,

    tools,
    toolQuery,
    setToolQuery,
    toolResults,
    searchTools,
    addTool,
    updateTool,
    removeTool,
    onToolDrag,

    faqs,
    faqOpen,
    setFaqOpen,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    addFaq,
    updateFaq,
    removeFaq,
    onFaqDrag,

    save,
    create,
    publish,
  };
}

export type SeoPageEditor = ReturnType<typeof useSeoPageEditor>;
