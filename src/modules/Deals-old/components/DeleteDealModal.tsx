import { Trash2 } from "lucide-react";
import type { Deal } from "../types";

interface DeleteDealModalProps {
  deal: Deal | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteDealModal = ({ deal, onCancel, onConfirm }: DeleteDealModalProps) => {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Delete "{deal.title}"?
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(deal.id)}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
