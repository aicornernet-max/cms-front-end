import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm, type Path } from "react-hook-form";
import { Link } from "react-router-dom";
import ImageUpload from "../../../components/common/ImageUpload";
import BioField from "./BioField";
import SocialLinksFields from "./SocialLinksFields";
import { authorFormSchema, type AuthorFormValues } from "../validation/author.validation";
import type { AuthorFieldErrors } from "../hooks/useCreateAuthor";

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface AuthorFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<AuthorFormValues>;
  existingImageUrl?: string;
  isSubmitting: boolean;
  fieldErrors?: AuthorFieldErrors | null;
  onSubmit: (values: AuthorFormValues, imageFile: File | null) => void;
  cancelHref: string;
}

const BASE_DEFAULT_VALUES: AuthorFormValues = {
  name: "",
  slug: "",
  bio: "",
  isActive: true,
  socialLinks: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    github: "",
  },
};

export default function AuthorForm({
  mode,
  defaultValues,
  existingImageUrl,
  isSubmitting,
  fieldErrors,
  onSubmit,
  cancelHref,
}: AuthorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AuthorFormValues>({
    defaultValues: { ...BASE_DEFAULT_VALUES, ...defaultValues },
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(existingImageUrl ?? "");
  const [imageError, setImageError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const nameValue = watch("name");
  const slugValue = watch("slug");
  const bioValue = watch("bio");
  const isActiveValue = watch("isActive");

  // Auto-generate slug from name on create, until the user edits it manually.
  // Never auto-regenerate on edit, per requirement.
  useEffect(() => {
    if (mode !== "create" || slugTouched) return;
    setValue("slug", generateSlug(nameValue || ""), { shouldDirty: false });
  }, [nameValue, slugTouched, mode, setValue]);

  // Map backend field-level errors (e.g. duplicate slug) onto the form.
  useEffect(() => {
    if (!fieldErrors) return;
    (Object.keys(fieldErrors) as (keyof AuthorFieldErrors)[]).forEach((field) => {
      const message = fieldErrors[field];
      if (message) setError(field, { message });
    });
  }, [fieldErrors, setError]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    setImageFile(file);
    setImagePreview(objectUrl);
    setImageError(null);
    event.target.value = "";
  };

  const handleImageRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImageFile(null);
    setImagePreview("");
  };

  const submit = handleSubmit((values) => {
    const parsed = authorFormSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as Path<AuthorFormValues>;
        setError(path, { message: issue.message });
      });
      return;
    }

    if (mode === "create" && !imageFile) {
      setImageError("Profile image is required.");
      return;
    }
    if (mode === "edit" && !imagePreview && !imageFile) {
      setImageError("Profile image is required.");
      return;
    }
    setImageError(null);

    onSubmit(parsed.data, imageFile);
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="author-name" className="text-sm font-medium text-gray-700">
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              id="author-name"
              type="text"
              placeholder="e.g. Bhaskara K S"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "author-name-error" : undefined}
              {...register("name")}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
              }`}
            />
            {errors.name && (
              <p id="author-name-error" className="text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="author-slug" className="text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="author-slug"
              type="text"
              placeholder="e.g. bhaskara-k-s"
              value={slugValue}
              onChange={(event) => {
                setSlugTouched(true);
                setValue("slug", generateSlug(event.target.value), { shouldDirty: true });
              }}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? "author-slug-error" : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.slug
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
              }`}
            />
            {errors.slug && (
              <p id="author-slug-error" className="text-xs text-red-600">
                {errors.slug.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <ImageUpload
            label="Profile Image *"
            preview={imagePreview}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
          />
          {imageError && <p className="mt-1.5 text-xs text-red-600">{imageError}</p>}
        </div>

        <div className="mt-4">
          <BioField
            value={bioValue}
            onChange={(value) => setValue("bio", value, { shouldDirty: true })}
            error={errors.bio?.message}
          />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Active Status</p>
            <p className="text-xs text-gray-500">
              Inactive authors are hidden from the public site but remain in the CMS.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActiveValue}
            onClick={() => setValue("isActive", !isActiveValue, { shouldDirty: true })}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              isActiveValue ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActiveValue ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <SocialLinksFields register={register} errors={errors} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link
          to={cancelHref}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Author"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
