import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Deal } from "../types";
import { DealStatusBadge } from "./DealStatusBadge";

interface DealRowProps {
  deal: Deal;
  onDeleteClick: (deal: Deal) => void;
}

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatPrice = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
};

export const DealRow = ({ deal, onDeleteClick }: DealRowProps) => {
  const navigate = useNavigate();
  const [imgErrored, setImgErrored] = useState(false);

  return (
    <tr className="border-t border-gray-100 transition-colors hover:bg-gray-50">
      {/* COVER IMAGE */}
      <td className="p-4">
        {deal.coverImage && !imgErrored ? (
          <img
            src={deal.coverImage}
            alt={deal.title}
            onError={() => setImgErrored(true)}
            className="h-12 w-16 rounded-lg border border-gray-200 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-400">
            No image
          </div>
        )}
      </td>

      {/* DEAL */}
      <td className="p-4">
        <p className="font-medium text-gray-900">{deal.title}</p>
        <p className="text-xs text-gray-400">{deal.slug}</p>
      </td>

      {/* TOOL */}
      <td className="p-4">
        <p className="text-sm text-gray-700">{deal.tool.name}</p>
        <p className="text-xs text-gray-400">{deal.tool.categoryName}</p>
      </td>

      {/* PRICING */}
      <td className="p-4">
        <p className="text-sm text-gray-400 line-through">
          {formatPrice(deal.originalPrice, deal.currency)}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          {formatPrice(deal.discountPrice, deal.currency)}
        </p>
      </td>

      {/* DURATION */}
      <td className="p-4 whitespace-nowrap">
        <p className="text-sm text-gray-700">{formatDate(deal.startDate)}</p>
        <p className="text-xs text-gray-400">to {formatDate(deal.endDate)}</p>
      </td>

      {/* STATUS */}
      <td className="p-4">
        <DealStatusBadge status={deal.status} />
      </td>

      {/* ACTIONS */}
      <td className="p-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate(`/deals/edit/${deal.id}`)}
            title="Edit deal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-blue-600"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteClick(deal)}
            title="Delete deal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
};
