import { useEffect, useRef } from "react";
import { generateSlug } from "../../../../shared/utils/slug";
import { useSeoPageCategories } from "../../hooks/useSeoPageCategories";
import { FormField, inputClass, inputErrorClass } from "./FormPrimitives";

export interface BasicCoreValues {
  title: string;
  slug: string;
  categoryId: string;
}

interface BasicCoreFieldsProps {
  mode: "create" | "edit";
  values: BasicCoreValues;
  onChange: (patch: Partial<BasicCoreValues>) => void;
  errors?: Partial<Record<keyof BasicCoreValues, string>>;
}

export function BasicCoreFields({
  mode,
  values,
  onChange,
  errors,
}: BasicCoreFieldsProps) {
  const categoriesQuery = useSeoPageCategories();
  const slugTouched = useRef(false);

  useEffect(() => {
    if (slugTouched.current) return;
    if (mode === "edit" && values.slug) return;

    if (!values.title) {
      onChange({ slug: "" });
      return;
    }

    onChange({ slug: generateSlug(values.title) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.title, mode]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <FormField label="Title" htmlFor="seo-page-title" error={errors?.title}>
        <input
          id="seo-page-title"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Best AI Tools for Developers"
          className={errors?.title ? inputErrorClass : inputClass}
        />
      </FormField>

      <FormField label="Slug" htmlFor="seo-page-slug" error={errors?.slug}>
        <input
          id="seo-page-slug"
          value={values.slug}
          onChange={(e) => {
            slugTouched.current = true;
            onChange({ slug: e.target.value });
          }}
          placeholder="best-ai-tools-for-developers"
          className={errors?.slug ? inputErrorClass : inputClass}
        />
      </FormField>

      <FormField
        label="Category"
        htmlFor="seo-page-category"
        error={errors?.categoryId}
        fullWidth
      >
        <select
          id="seo-page-category"
          value={values.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value })}
          disabled={categoriesQuery.isLoading}
          className={errors?.categoryId ? inputErrorClass : inputClass}
        >
          <option value="">
            {categoriesQuery.isLoading ? "Loading categories…" : "Select a category…"}
          </option>
          {categoriesQuery.data?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}
