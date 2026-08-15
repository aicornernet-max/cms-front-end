import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../../../../components/common/ImageUpload";
import { useUpdateBasic } from "../../hooks/useUpdateSeoPageSection";
import { extractErrorMessage, extractFieldErrors } from "../../lib/errors";
import type { SeoPageV2 } from "../../types/seoPageV2.types";
import { SectionSaveBar } from "../editor/SectionSaveBar";
import { BasicCoreFields, type BasicCoreValues } from "./BasicCoreFields";
import { FormField, inputClass } from "./FormPrimitives";

interface BasicInformationSectionProps {
  page: SeoPageV2;
  readOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

interface FormState extends BasicCoreValues {
  pageDescription: string;
  categoryDescription: string;
}

function toFormState(page: SeoPageV2): FormState {
  return {
    title: page.title ?? "",
    slug: page.slug ?? "",
    categoryId: page.categoryId?._id ?? "",
    pageDescription: page.pageDescription ?? "",
    categoryDescription: page.categoryDescription ?? "",
  };
}

export function BasicInformationSection({
  page,
  readOnly,
  onDirtyChange,
}: BasicInformationSectionProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(page));
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [catImagePreview, setCatImagePreview] = useState(
    page.catImage?.url ?? "",
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateBasic = useUpdateBasic(page._id);

  useEffect(() => {
    setForm(toFormState(page));
    setCatImagePreview(page.catImage?.url ?? "");
    setCatImageFile(null);
  }, [page]);

  const isDirty =
    JSON.stringify(form) !== JSON.stringify(toFormState(page)) ||
    Boolean(catImageFile);

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const handleSave = () => {
    setFieldErrors({});

    updateBasic.mutate(
      {
        payload: {
          title: form.title,
          slug: form.slug,
          categoryId: form.categoryId,
          pageDescription: form.pageDescription,
          categoryDescription: form.categoryDescription,
        },
        catImageFile,
      },
      {
        onSuccess: () => {
          toast.success("Basic information saved");
          setCatImageFile(null);
        },
        onError: (error) => {
          const errors = extractFieldErrors(error);
          if (errors.length > 0) {
            setFieldErrors(
              Object.fromEntries(errors.map((e) => [e.field, e.message])),
            );
          }
          toast.error(extractErrorMessage(error, "Failed to save basic information"));
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Title, URL, category, and how this page introduces itself.
        </p>
      </div>

      <fieldset disabled={readOnly} className="space-y-5">
        <BasicCoreFields
          mode="edit"
          values={form}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          errors={{
            title: fieldErrors.title,
            slug: fieldErrors.slug,
            categoryId: fieldErrors.categoryId,
          }}
        />

        <FormField
          label="Page Description"
          htmlFor="seo-page-description"
          error={fieldErrors.pageDescription}
        >
          <textarea
            id="seo-page-description"
            rows={3}
            value={form.pageDescription}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, pageDescription: e.target.value }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Category Description"
          htmlFor="seo-category-description"
          error={fieldErrors.categoryDescription}
        >
          <textarea
            id="seo-category-description"
            rows={3}
            value={form.categoryDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                categoryDescription: e.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <ImageUpload
          label="Category Image"
          preview={catImagePreview}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setCatImageFile(file);
            setCatImagePreview(URL.createObjectURL(file));
          }}
          onRemove={() => {
            setCatImageFile(null);
            setCatImagePreview("");
          }}
        />
      </fieldset>

      <SectionSaveBar
        isDirty={isDirty}
        isSaving={updateBasic.isPending}
        isError={updateBasic.isError}
        onSave={handleSave}
        disabled={readOnly}
        saveLabel="Save Basic Info"
      />
    </div>
  );
}
