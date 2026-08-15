import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateSeo } from "../../hooks/useUpdateSeoPageSection";
import { extractErrorMessage, extractFieldErrors } from "../../lib/errors";
import type { SeoPageV2 } from "../../types/seoPageV2.types";
import { SectionSaveBar } from "../editor/SectionSaveBar";
import { FormField, inputClass } from "./FormPrimitives";

interface SeoMetaSectionProps {
  page: SeoPageV2;
  readOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

interface FormState {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

function toFormState(page: SeoPageV2): FormState {
  return {
    metaTitle: page.meta?.title ?? "",
    metaDescription: page.meta?.description ?? "",
    keywords: page.meta?.keywords ?? [],
  };
}

export function SeoMetaSection({
  page,
  readOnly,
  onDirtyChange,
}: SeoMetaSectionProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(page));
  const [keywordInput, setKeywordInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateSeo = useUpdateSeo(page._id);

  useEffect(() => {
    setForm(toFormState(page));
  }, [page]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(toFormState(page));

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const addKeyword = () => {
    const value = keywordInput.trim();
    if (!value || form.keywords.includes(value)) {
      setKeywordInput("");
      return;
    }
    setForm((prev) => ({ ...prev, keywords: [...prev.keywords, value] }));
    setKeywordInput("");
  };

  const removeKeyword = (keyword: string) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleSave = () => {
    setFieldErrors({});

    updateSeo.mutate(
      {
        meta: {
          title: form.metaTitle,
          description: form.metaDescription,
          keywords: form.keywords,
        },
      },
      {
        onSuccess: () => toast.success("SEO details saved"),
        onError: (error) => {
          const errors = extractFieldErrors(error);
          if (errors.length > 0) {
            setFieldErrors(
              Object.fromEntries(errors.map((e) => [e.field, e.message])),
            );
          }
          toast.error(extractErrorMessage(error, "Failed to save SEO details"));
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">SEO & Meta</h2>
        <p className="mt-1 text-sm text-slate-500">
          Controls how this page appears in search results.
        </p>
      </div>

      <fieldset disabled={readOnly} className="space-y-5">
        <FormField
          label="Meta Title"
          htmlFor="seo-meta-title"
          error={fieldErrors["meta.title"]}
          hint={`${form.metaTitle.length} characters`}
        >
          <input
            id="seo-meta-title"
            value={form.metaTitle}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Meta Description"
          htmlFor="seo-meta-description"
          error={fieldErrors["meta.description"]}
          hint={`${form.metaDescription.length} characters`}
        >
          <textarea
            id="seo-meta-description"
            rows={3}
            value={form.metaDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                metaDescription: e.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Keywords"
          htmlFor="seo-meta-keywords"
          error={fieldErrors["meta.keywords"]}
        >
          <div className="flex gap-2">
            <input
              id="seo-meta-keywords"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
              placeholder="Type a keyword and press Enter"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="shrink-0 rounded-lg border border-slate-300 px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Add
            </button>
          </div>

          {form.keywords.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {form.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    aria-label={`Remove ${keyword}`}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </FormField>
      </fieldset>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Search preview
        </p>
        <p className="truncate text-sm text-blue-700">
          {form.metaTitle || page.title || "Untitled page"}
        </p>
        <p className="truncate text-xs text-emerald-700">
          {page.slug ? `example.com/${page.slug}` : "example.com/…"}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {form.metaDescription || "No meta description yet."}
        </p>
      </div>

      <SectionSaveBar
        isDirty={isDirty}
        isSaving={updateSeo.isPending}
        isError={updateSeo.isError}
        onSave={handleSave}
        disabled={readOnly}
        saveLabel="Save SEO"
      />
    </div>
  );
}
