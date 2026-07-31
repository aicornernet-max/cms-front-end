import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DealsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Deals Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage affiliate deals, discounts, and promotional offers.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/deals/create")}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Deal
      </button>
    </div>
  );
};
