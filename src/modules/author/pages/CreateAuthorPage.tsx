import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthorForm from "../components/AuthorForm";
import { useCreateAuthor, type AuthorFieldErrors } from "../hooks/useCreateAuthor";
import type { AuthorFormValues } from "../validation/author.validation";

export default function CreateAuthorPage() {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<AuthorFieldErrors | null>(null);
  const { createAuthor, isSubmitting } = useCreateAuthor(() => {
    navigate("/admin/authors");
  });

  const handleSubmit = async (values: AuthorFormValues, imageFile: File | null) => {
    const errors = await createAuthor({
      name: values.name,
      slug: values.slug,
      bio: values.bio,
      isActive: values.isActive,
      socialLinks: values.socialLinks,
      profileImage: imageFile,
    });
    setFieldErrors(errors);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/admin/authors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Author Profiles
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-gray-900">Add Author</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new author profile to attribute content to.
        </p>
      </div>

      <AuthorForm
        mode="create"
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        cancelHref="/admin/authors"
      />
    </div>
  );
}
