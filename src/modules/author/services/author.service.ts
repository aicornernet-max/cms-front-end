import axiosInstance from "../../../api/axios";
import type {
  Author,
  AuthorListParams,
  AuthorListResponse,
  AuthorPayload,
  AuthorResponse,
  AuthorStatusPayload,
} from "../types/author.types";

const BASE_URL = "/admin/authors";

/**
 * Builds multipart FormData for create/update requests. The backend owns
 * image storage (Cloudinary etc.) — the frontend only ever sends the raw
 * file, matching the pattern used by the Tools module.
 */
function buildAuthorFormData(payload: AuthorPayload): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("slug", payload.slug);
  formData.append("bio", payload.bio);
  formData.append("isActive", String(payload.isActive));

  if (payload.socialLinks) {
    const socialLinks = Object.fromEntries(
      Object.entries(payload.socialLinks).filter(
        ([, value]) => value?.trim() !== ""
      )
    );

    // Only send socialLinks when at least one value exists
    if (Object.keys(socialLinks).length > 0) {
      formData.append("socialLinks", JSON.stringify(socialLinks));
    }
  }

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  return formData;
}

/**
 * Fetches the paginated, filterable list of authors.
 * All API access for this module goes through this service —
 * components and hooks must never call axios directly.
 */
async function getAuthors(
  params: AuthorListParams
): Promise<AuthorListResponse> {
  const { data } = await axiosInstance.get<AuthorListResponse>(BASE_URL, {
    params,
  });
  return data;
}

async function createAuthor(payload: AuthorPayload): Promise<AuthorResponse> {
  const { data } = await axiosInstance.post<AuthorResponse>(
    BASE_URL,
    buildAuthorFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

async function updateAuthor(
  id: string,
  payload: AuthorPayload
): Promise<AuthorResponse> {
  const { data } = await axiosInstance.patch<AuthorResponse>(
    `${BASE_URL}/${id}`,
    buildAuthorFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

/**
 * Activate/deactivate only — no image involved, so a plain JSON PATCH.
 */
async function updateAuthorStatus(
  id: string,
  payload: AuthorStatusPayload
): Promise<AuthorResponse> {
  const { data } = await axiosInstance.patch<AuthorResponse>(
    `${BASE_URL}/${id}`,
    payload
  );
  return data;
}

async function getAuthorById(id: string): Promise<Author> {
  const { data } = await axiosInstance.get<AuthorResponse>(
    `${BASE_URL}/${id}`
  );
  return data.data;
}

export const authorService = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  updateAuthorStatus,
};
