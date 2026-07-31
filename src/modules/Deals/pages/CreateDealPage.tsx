import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ToolSearchSelect } from "../components/ToolSearchSelect";
import { FormField, inputClass, inputErrorClass } from "../components/FormField";
import { useCreateDraft } from "../hooks/useCreateDraft";
import type { ToolSearchResult } from "../types/deal.types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CreateDealPage() {
  const navigate = useNavigate();
  const createDraft = useCreateDraft();

  const [tool, setTool] = useState<ToolSearchResult | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<{ tool?: string; title?: string; slug?: string }>(
    {}
  );

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function validate() {
    const next: typeof errors = {};
    if (!tool) next.tool = "Please select a tool.";
    if (!title.trim()) next.title = "Title is required.";
    if (!slug.trim()) next.slug = "Slug is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !tool) return;

    try {
      const draft = await createDraft.mutateAsync({
        toolId: tool.id,
        slug: slug.trim(),
        title: title.trim(),
      });
      toast.success("Draft created");
      navigate(`/admin/deals/${draft._id}/edit`, { replace: true });
    } catch {
      toast.error("Failed to create draft");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link
        to="/admin/deals"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to deals
      </Link>

      <h1 className="text-xl font-semibold text-slate-900">Create Deal</h1>
      <p className="mt-1 text-sm text-slate-500">
        Start with the basics — you can fill in pricing, coupons, and the
        cover image once the draft is created.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <FormField label="Tool" error={errors.tool}>
          <ToolSearchSelect
            selectedTool={tool}
            onSelect={(t) => {
              setTool(t);
              setErrors((prev) => ({ ...prev, tool: undefined }));
            }}
            onClear={() => setTool(null)}
          />
        </FormField>

        <FormField label="Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. ChatGPT Plus 50% Off Annual Plan"
            className={errors.title ? inputErrorClass : inputClass}
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" error={errors.slug}>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="chatgpt-plus-50-off-annual-plan"
            className={errors.slug ? inputErrorClass : inputClass}
          />
        </FormField>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={createDraft.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createDraft.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Create Draft
          </button>
        </div>
      </form>
    </div>
  );
}
