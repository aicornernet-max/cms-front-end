import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Advertisement } from "../types/advertisement.types";
import {
  useDeleteAdvertisement,
  useMarkReady,
  useCreateVersion,
} from "../hooks/useAdvertisementMutations";
import {
  canCreateVersion,
  canDeleteAdvertisement,
  canMarkReady,
} from "../utils/advertisement.utils";
import ConfirmDialog from "./ConfirmDialog";

interface AdvertisementActionsBarProps {
  advertisement: Advertisement;
}

const AdvertisementActionsBar = ({
  advertisement,
}: AdvertisementActionsBarProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const markReadyMutation = useMarkReady(advertisement.id);
  const createVersionMutation = useCreateVersion();
  const deleteMutation = useDeleteAdvertisement();

  const handleMarkReady = () => {
    setValidationErrors([]);
    markReadyMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (!result.success && result.errors) {
          setValidationErrors(result.errors.map((e) => e.message));
        }
      },
    });
  };

  const handleCreateVersion = () => {
    createVersionMutation.mutate(advertisement.id, {
      onSuccess: (newVersion) => {
        navigate(`/advertisements/${newVersion.id}`);
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(advertisement.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        navigate("/advertisements");
      },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {canMarkReady(advertisement.status) && (
          <button
            type="button"
            onClick={handleMarkReady}
            disabled={markReadyMutation.isPending}
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {markReadyMutation.isPending ? "Checking..." : "Mark Ready"}
          </button>
        )}

        {canCreateVersion(advertisement.status) && (
          <button
            type="button"
            onClick={handleCreateVersion}
            disabled={createVersionMutation.isPending}
            className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          >
            {createVersionMutation.isPending
              ? "Creating..."
              : "Create New Version"}
          </button>
        )}

        {canDeleteAdvertisement(advertisement.status) && (
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>

      {validationErrors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">
            This advertisement cannot be marked ready yet:
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-red-700">
            {validationErrors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete this advertisement?"
        description="This action cannot be undone. Only draft advertisements can be deleted."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default AdvertisementActionsBar;
