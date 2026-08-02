import { useNavigate } from "react-router-dom";
import type {
  Advertisement,
  Pagination,
} from "../types/advertisement.types";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/advertisement.utils";

interface AdvertisementTableProps {
  advertisements: Advertisement[] | undefined;
  pagination: Pagination | undefined;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (page: number) => void;
}

const SKELETON_ROWS = 8;

const AdvertisementTable = ({
  advertisements,
  pagination,
  isLoading,
  isError,
  onPageChange,
}: AdvertisementTableProps) => {
  const navigate = useNavigate();

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
        Something went wrong while loading advertisements. Please try again.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Tool",
              "Booking",
              "Vendor",
              "Version",
              "Status",
              "Start Date",
              "End Date",
              "Created",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading &&
            Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <tr key={`skeleton-${index}`}>
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-gray-200" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && (advertisements?.length ?? 0) === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                No advertisements found. Try adjusting your filters, or create
                one from a booking.
              </td>
            </tr>
          )}

          {!isLoading &&
            advertisements?.map((ad) => (
              <tr
                key={ad._id}
                onClick={() => navigate(`/advertisements/${ad._id}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="flex items-center gap-2 px-4 py-3">
                  {ad.tool?.image ? (
                    <img
                      src={ad.tool.image}
                      alt={ad.tool?.name ?? "Tool"}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gray-200" />
                  )}

                  <span className="font-medium text-gray-900">
                    {ad.tool?.name ?? "-"}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {ad.booking?.bookingNumber ?? "-"}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {ad.vendor?.companyName ?? "-"}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {ad.version ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {ad.status ? (
                    <StatusBadge status={ad.status} />
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {ad.utcStartDate ? formatDate(ad.utcStartDate) : "-"}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {ad.utcEndDate ? formatDate(ad.utcEndDate) : "-"}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {ad.createdAt ? formatDate(ad.createdAt) : "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
          <span>
            Page {pagination.page} of {pagination.totalPages} &middot;{" "}
            {pagination.total} total
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="rounded-md border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="rounded-md border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementTable;