import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdvertisements } from "../hooks/useAdvertisements";
import AdvertisementFilters from "../components/AdvertisementFilters";
import AdvertisementTable from "../components/AdvertisementTable";
import type { AdvertisementListParams } from "../types/advertisement.types";

const DEFAULT_FILTERS: AdvertisementListParams = {
  page: 1,
  limit: 10,
};

const AdvertisementListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AdvertisementListParams>(
    DEFAULT_FILTERS
  );

  const { data, isLoading, isError } = useAdvertisements(filters);

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Advertisements
          </h1>
          <p className="text-sm text-gray-500">
            Manage advertisement content, publishing, and version history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/advertisements/new")}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Create Advertisement
        </button>
      </div>

      <AdvertisementFilters filters={filters} onChange={setFilters} />

      <AdvertisementTable
        advertisements={data?.items}
        pagination={data?.pagination}
        isLoading={isLoading}
        isError={isError}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default AdvertisementListPage;
