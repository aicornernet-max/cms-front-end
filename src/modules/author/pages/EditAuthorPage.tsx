import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthorForm from "../components/AuthorForm";
import FullScreenLoader from "../../../components/ui/FullScreenLoader";
import { useAuthor } from "../hooks/useAuthor";
import { useUpdateAuthor } from "../hooks/useUpdateAuthor";
import type { AuthorFieldErrors } from "../hooks/useCreateAuthor";
import type { AuthorFormValues } from "../validation/author.validation";

export default function EditAuthorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<AuthorFieldErrors | null>(null);

  const { author, isLoading, error } = useAuthor(id);
  const { updateAuthor, isSubmitting } = useUpdateAuthor(() => {
    navigate("/admin/authors");
  });

  const handleSubmit = async (values: AuthorFormValues, imageFile: File | null) => {
    if (!id) return;
    const errors = await updateAuthor(id, {
      name: values.name,
      slug: values.slug,
      bio: values.bio,
      isActive: values.isActive,
      socialLinks: values.socialLinks,
      profileImage: imageFile,
    });
    setFieldErrors(errors);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error || !author) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
        <h3 className="text-base font-semibold text-gray-900">Author not found</h3>
        <p className="max-w-sm text-sm text-gray-500">
          The author profile you're looking for doesn't exist or could not be loaded.
        </p>
        <Link
          to="/admin/authors"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to Author Profiles
        </Link>
      </div>
    );
  }

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
        <h1 className="mt-2 text-xl font-semibold text-gray-900">Edit Author</h1>
        <p className="mt-1 text-sm text-gray-500">Update {author.name}'s profile.</p>
      </div>

      <AuthorForm
        mode="edit"
        defaultValues={{
          name: author.name,
          slug: author.slug,
          bio: author.bio,
          isActive: author.isActive,
          socialLinks: {
            linkedin: author.socialLinks?.linkedin ?? "",
            twitter: author.socialLinks?.twitter ?? "",
            facebook: author.socialLinks?.facebook ?? "",
            instagram: author.socialLinks?.instagram ?? "",
            github: author.socialLinks?.github ?? "",
          },
        }}
        existingImageUrl={author.profileImage?.url}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        cancelHref="/admin/authors"
      />
    </div>
  );
}
