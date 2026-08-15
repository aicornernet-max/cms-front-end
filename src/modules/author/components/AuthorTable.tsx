import { Link } from "react-router-dom";
import { Pencil, UserCheck, UserX } from "lucide-react";
import AuthorStatusBadge from "./AuthorStatusBadge";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";
import type { Author } from "../types/author.types";

interface AuthorTableProps {
  authors: Author[];
  isLoading: boolean;
  isFiltered: boolean;
  updatingId: string | null;
  onDeactivateRequest: (author: Author) => void;
  onActivate: (author: Author) => void;
}

const COLUMNS = ["Image", "Name", "Slug", "Status", "Updated", "Actions"];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusAction({
  author,
  isUpdating,
  onDeactivateRequest,
  onActivate,
}: {
  author: Author;
  isUpdating: boolean;
  onDeactivateRequest: (author: Author) => void;
  onActivate: (author: Author) => void;
}) {
  if (author.isActive) {
    return (
      <button
        type="button"
        onClick={() => onDeactivateRequest(author)}
        disabled={isUpdating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UserX className="h-3.5 w-3.5" aria-hidden="true" />
        Deactivate
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onActivate(author)}
      disabled={isUpdating}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {isUpdating ? "Activating..." : "Activate"}
    </button>
  );
}

export default function AuthorTable({
  authors,
  isLoading,
  isFiltered,
  updatingId,
  onDeactivateRequest,
  onActivate,
}: AuthorTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <LoadingSkeleton />
      </div>
    );
  }

  if (authors.length === 0) {
    return <EmptyState isFiltered={isFiltered} />;
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm sm:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-6 ${
                    column === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {authors.map((author) => (
              <tr key={author._id} className="hover:bg-gray-50/60">
                <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                  <img
                    src={author.profileImage?.url}
                    alt={author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 sm:px-6">
                  {author.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 sm:px-6">
                  {author.slug}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                  <AuthorStatusBadge isActive={author.isActive} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 sm:px-6">
                  {formatDate(author.updatedAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right sm:px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/authors/${author._id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <StatusAction
                      author={author}
                      isUpdating={updatingId === author._id}
                      onDeactivateRequest={onDeactivateRequest}
                      onActivate={onActivate}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {authors.map((author) => (
          <div
            key={author._id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={author.profileImage?.url}
                alt={author.name}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {author.name}
                </p>
                <p className="truncate text-xs text-gray-500">{author.slug}</p>
              </div>
              <AuthorStatusBadge isActive={author.isActive} />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Updated {formatDate(author.updatedAt)}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Link
                to={`/admin/authors/${author._id}/edit`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </Link>
              <div className="flex-1">
                <StatusAction
                  author={author}
                  isUpdating={updatingId === author._id}
                  onDeactivateRequest={onDeactivateRequest}
                  onActivate={onActivate}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
