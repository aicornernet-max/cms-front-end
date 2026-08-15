import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BasicCoreFields, type BasicCoreValues } from "../components/sections/BasicCoreFields";
import { useCreateSeoPageV2 } from "../hooks/useCreateSeoPageV2";
import { extractErrorMessage, extractFieldErrors } from "../lib/errors";

const EMPTY_VALUES: BasicCoreValues = {
  title: "",
  slug: "",
  categoryId: "",
};

export default function SeoPageCreatePage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<BasicCoreValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof BasicCoreValues, string>>
  >({});

  const createPage = useCreateSeoPageV2();

  const validate = (): boolean => {
    const errors: Partial<Record<keyof BasicCoreValues, string>> = {};
    if (!values.title.trim()) errors.title = "Title is required";
    if (!values.slug.trim()) errors.slug = "Slug is required";
    if (!values.categoryId) errors.categoryId = "Category is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createPage.mutate(
      {
        title: values.title.trim(),
        slug: values.slug.trim(),
        categoryId: values.categoryId,
      },
      {
        onSuccess: (page) => {
          toast.success("Draft created");
          navigate(`/pages/edit/${page._id}`, { replace: true });
        },
        onError: (error) => {
          const errors = extractFieldErrors(error);
          if (errors.length > 0) {
            setFieldErrors(
              Object.fromEntries(
                errors.map((err) => [err.field, err.message]),
              ) as Partial<Record<keyof BasicCoreValues, string>>,
            );
          }
          toast.error(extractErrorMessage(error, "Failed to create page"));
        },
      },
    );
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          to="/pages"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to SEO Pages
        </Link>

        <div>
          <p className="text-sm font-medium text-blue-600">SEO Management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Create SEO Page
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start with the basics — you can fill in SEO, content, tools, and
            FAQs after the draft is created.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <BasicCoreFields
            mode="create"
            values={values}
            onChange={(patch) =>
              setValues((prev) => ({ ...prev, ...patch }))
            }
            errors={fieldErrors}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <Link
              to="/pages"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createPage.isPending}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createPage.isPending ? "Creating…" : "Create Draft"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
