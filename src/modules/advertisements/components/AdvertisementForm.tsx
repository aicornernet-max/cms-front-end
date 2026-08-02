import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Advertisement, ToolSearchResult } from "../types/advertisement.types";
import {
  updateAdvertisementSchema,
  type UpdateAdvertisementFormValues,
} from "../validations/advertisement.validation";
import ToolAutocomplete from "./ToolAutocomplete";
import { canEditAdvertisement, formatCurrency } from "../utils/advertisement.utils";

interface AdvertisementFormProps {
  advertisement: Advertisement;
  onSubmit: (values: UpdateAdvertisementFormValues) => void;
  isSubmitting: boolean;
}

const AdvertisementForm = ({
  advertisement,
  onSubmit,
  isSubmitting,
}: AdvertisementFormProps) => {
  const isEditable = advertisement?.status
    ? canEditAdvertisement(advertisement.status)
    : false;
  const [selectedTool, setSelectedTool] = useState<ToolSearchResult>(
    advertisement?.tool ?? ({} as ToolSearchResult)
  );

  const {
    register,
    handleSubmit,
    control,
     setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateAdvertisementFormValues>({
    resolver: zodResolver(updateAdvertisementSchema),
    defaultValues: {
      toolId: advertisement?.tool?.id ?? "",
      backgroundImage: advertisement?.backgroundImage ?? "",
      title: advertisement?.title ?? "",
      description: advertisement?.description ?? "",
      originalPrice: advertisement?.originalPrice ?? 0,
      dealPrice: advertisement?.dealPrice ?? 0,
      claimDealUrl: advertisement?.claimDealUrl ?? "",
    },
  });

  if (!isEditable) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Content</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Tool
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900">
              {advertisement?.tool?.image ? (
                <img
                  src={advertisement.tool.image}
                  alt={advertisement.tool.name ?? ""}
                  className="h-6 w-6 rounded object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded object-cover" />
              )}
              {advertisement?.tool?.name ?? ""} &middot;{" "}
              {advertisement?.tool?.brand ?? ""}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Title
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {advertisement?.title ?? ""}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Description
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
              {advertisement?.description ?? ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Original Price
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {advertisement?.originalPrice != null
                ? formatCurrency(advertisement.originalPrice)
                : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Deal Price
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {advertisement?.dealPrice != null
                ? formatCurrency(advertisement.dealPrice)
                : ""}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Claim Deal URL
            </dt>
            <dd className="mt-1 break-all text-sm text-indigo-600">
              {advertisement?.claimDealUrl ?? ""}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-gray-500">
          This advertisement is {(advertisement?.status ?? "").toLowerCase()} and can
          no longer be edited. Create a new version to make changes.
        </p>
      </div>
    );
  }

  const submitForm = (values: UpdateAdvertisementFormValues) => {
    onSubmit({ ...values, toolId: selectedTool?.id ?? "" });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-5"
    >
      <h3 className="text-sm font-semibold text-gray-700">Content</h3>

      <ToolAutocomplete
        value={selectedTool}
        onChange={(tool) => {
    setSelectedTool(tool);

    setValue("toolId", tool.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }}
        error={errors.toolId?.message}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Background Image URL
        </label>
        <input
          type="text"
          {...register("backgroundImage")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.backgroundImage && (
          <p className="mt-1 text-xs text-red-600">
            {errors.backgroundImage.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={4}
          {...register("description")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Original Price
          </label>
          <Controller
            control={control}
            name="originalPrice"
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            )}
          />
          {errors.originalPrice && (
            <p className="mt-1 text-xs text-red-600">
              {errors.originalPrice.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Deal Price
          </label>
          <Controller
            control={control}
            name="dealPrice"
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            )}
          />
          {errors.dealPrice && (
            <p className="mt-1 text-xs text-red-600">
              {errors.dealPrice.message}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Offer percentage is calculated automatically by the backend and
        shown in the snapshot panel above - it cannot be set here.
      </p>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Claim Deal URL
        </label>
        <input
          type="text"
          {...register("claimDealUrl")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.claimDealUrl && (
          <p className="mt-1 text-xs text-red-600">
            {errors.claimDealUrl.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default AdvertisementForm;