import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdvertisement } from "../hooks/useAdvertisements";
import { useUpdateAdvertisement } from "../hooks/useAdvertisementMutations";
import AdvertisementReadOnlyInfo from "../components/AdvertisementReadOnlyInfo";
import AdvertisementForm from "../components/AdvertisementForm";
import AdvertisementActionsBar from "../components/AdvertisementActionsBar";
import StatusBadge from "../components/StatusBadge";

const DetailsSkeleton = () => (
  <div className="space-y-4 p-6">
    <div className="h-6 w-64 animate-pulse rounded bg-gray-200" />
    <div className="h-32 w-full animate-pulse rounded-lg bg-gray-200" />
    <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200" />
  </div>
);

const AdvertisementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: advertisement, isLoading, isError } = useAdvertisement(id);

  const updateMutation = useUpdateAdvertisement(id ?? "");

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (isError || !advertisement) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          This advertisement could not be loaded.
        </div>

        <button
          type="button"
          onClick={() => navigate("/advertisements")}
          className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
        >
          Back to advertisements
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div>
        <Link
          to="/advertisements"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          &larr; Back to advertisements
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            {advertisement.title ?? "-"}
          </h1>

          {advertisement.status ? (
            <StatusBadge status={advertisement.status} />
          ) : null}
        </div>

        <AdvertisementActionsBar advertisement={advertisement} />
      </div>

      <AdvertisementReadOnlyInfo advertisement={advertisement} />

      <AdvertisementForm
        advertisement={advertisement}
        onSubmit={(values) => updateMutation.mutate(values)}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};

export default AdvertisementDetailsPage;