import type { PaginationMeta } from "../../../components/common/Pagination";

export interface AuthorProfileImage {
  url: string;
  publicId: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  profileImage: AuthorProfileImage | null;
  socialLinks: SocialLinks;
  bio: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuthorPagination = PaginationMeta;

export interface AuthorListData {
  authors: Author[];
  pagination: AuthorPagination;
}

export interface AuthorListResponse {
  success: boolean;
  message?: string;
  data: AuthorListData;
}

export interface AuthorResponse {
  success: boolean;
  message?: string;
  data: Author;
}

export type StatusFilter = "all" | "active" | "inactive";

export interface AuthorListParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

/**
 * Payload shape sent to the backend. Everything is optional except when
 * creating (the form + service layer are responsible for ensuring a
 * profile image is attached on create). Kept separate from `Author` so UI
 * components never see backend-only concerns.
 */
export interface AuthorPayload {
  name: string;
  slug: string;
  bio: string;
  isActive: boolean;
  socialLinks?: SocialLinks;
  profileImage?: File | null;
}

export interface AuthorStatusPayload {
  isActive: boolean;
}
