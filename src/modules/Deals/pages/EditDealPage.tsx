import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Lock } from "lucide-react";

import { useDeal } from "../hooks/useDeal";
import { useAutoSaveDraft } from "../hooks/useAutoSaveDraft";
import {
  usePublishDraft,
  extractPublishFieldErrors,
  extractPublishMessage,
} from "../hooks/usePublishDraft";
import { buildDraftFormData } from "../lib/buildDraftFormData";

import { FormSection } from "../components/FormSection";
import { FormField, inputClass, inputErrorClass } from "../components/FormField";
import { ImageUploadField } from "../components/ImageUploadField";
import { StickyPublishBar } from "../components/StickyPublishBar";
import type { AutoSaveStatus } from "../components/AutoSaveIndicator";
import { EmptyState } from "../components/EmptyState";

import {
  BILLING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  COUPON_VISIBILITY_OPTIONS,
  type DealFormValues,
} from "../types/deal.types";

const AUTOSAVE_DELAY_MS = 2000;

export function EditDealPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: deal, isLoading, isError } = useDeal(id);
  const autoSave = useAutoSaveDraft(id);
  const publishDraft = usePublishDraft(id);

  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const {
    register,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm<DealFormValues>({ defaultValues: {} });

  const hydrated = useRef(false);

  // Populate the form once the deal loads.
  useEffect(() => {
    if (deal && !hydrated.current) {
      reset({
        title: deal.title ?? "",
        slug: deal.slug ?? "",
        affiliateUrl: deal.affiliateUrl ?? "",
        originalPrice: deal.originalPrice ?? "",
        discountPrice: deal.discountPrice ?? "",
        currency: deal.currency ?? "",
        billingType: deal.billingType ?? "",
        dealType: deal.dealType ?? "",
        couponCode: deal.couponCode ?? "",
        couponVisibility: deal.couponVisibility ?? "visible",
        startDate: deal.startDate ?? "",
        endDate: deal.endDate ?? "",
        description: deal.description ?? "",
      });
      hydrated.current = true;
    }
  }, [deal, reset]);

  const watchedValues = watch();

  // Debounced auto-save: fires 2s after the last change to a dirty field
  // or after a new cover image is selected.
  useEffect(() => {
    if (!hydrated.current) return;

    const dirtyKeys = Object.keys(dirtyFields) as (keyof DealFormValues)[];
    if (dirtyKeys.length === 0 && !coverImageFile) return;

    setAutoSaveStatus("saving");
    const timer = setTimeout(async () => {
      const formData = buildDraftFormData(
        watchedValues,
        dirtyKeys,
        coverImageFile
      );
      try {
        const updated = await autoSave.mutateAsync(formData);
        setAutoSaveStatus("saved");
        setCoverImageFile(null);
        // Clear dirty flags but keep the current on-screen values so typing
        // isn't interrupted.
        reset(
          {
            title: updated.title ?? "",
            slug: updated.slug ?? "",
            affiliateUrl: updated.affiliateUrl ?? "",
            originalPrice: updated.originalPrice ?? "",
            discountPrice: updated.discountPrice ?? "",
            currency: updated.currency ?? "",
            billingType: updated.billingType ?? "",
            dealType: updated.dealType ?? "",
            couponCode: updated.couponCode ?? "",
            couponVisibility: updated.couponVisibility ?? "visible",
            startDate: updated.startDate ?? "",
            endDate: updated.endDate ?? "",
            description: updated.description ?? "",
          },
          { keepDirty: false }
        );
      } catch {
        setAutoSaveStatus("error");
      }
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues), coverImageFile]);

  async function handlePublish() {
    if (!id) return;
    clearErrors();
    try {
      await publishDraft.mutateAsync();
      toast.success("Deal published");
      navigate("/admin/deals");
    } catch (err) {
      const fieldErrors = extractPublishFieldErrors(err);
      fieldErrors.forEach(({ field, message }) => {
        setError(field as keyof DealFormValues, { message });
      });
      toast.error(
        fieldErrors.length > 0
          ? "Please fix the highlighted fields before publishing."
          : extractPublishMessage(err)
      );
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !deal) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <EmptyState
          title="Deal not found"
          description="This draft may have been deleted or the link is invalid."
          action={
            <Link
              to="/admin/deals"
              className="rounded-lg bg-violet-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-violet-800"
            >
              Back to Deals
            </Link>
          }
        />
      </div>
    );
  }

  if (deal.status === "published") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <EmptyState
          title="This deal is already published"
          description='Create an Edit Draft from the Deals list to continue editing it.'
          action={
            <Link
              to="/admin/deals"
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-violet-800"
            >
              <Lock className="h-4 w-4" />
              Back to Deals
            </Link>
          }
        />
      </div>
    );
  }

  const toolName =
    typeof deal.toolId === "object" ? deal.toolId?.name : undefined;

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          to="/admin/deals"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to deals
        </Link>

        <h1 className="text-xl font-semibold text-slate-900">
          {deal.title || "Untitled deal"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Changes save automatically as you type.
        </p>

        <div className="mt-6 space-y-5">
          <FormSection title="Basic Information">
            <FormField label="Tool">
              <div className={`${inputClass} bg-slate-50 text-slate-500`}>
                {toolName ?? "—"}
              </div>
            </FormField>
            <FormField label="Title" htmlFor="title" error={errors.title?.message}>
              <input
                id="title"
                {...register("title")}
                className={errors.title ? inputErrorClass : inputClass}
              />
            </FormField>
            <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
              <input
                id="slug"
                {...register("slug")}
                className={errors.slug ? inputErrorClass : inputClass}
              />
            </FormField>
          </FormSection>

          <FormSection title="Pricing">
            <FormField
              label="Original Price"
              htmlFor="originalPrice"
              error={errors.originalPrice?.message}
            >
              <input
                id="originalPrice"
                type="number"
                step="0.01"
                {...register("originalPrice")}
                className={errors.originalPrice ? inputErrorClass : inputClass}
              />
            </FormField>
            <FormField
              label="Discount Price"
              htmlFor="discountPrice"
              error={errors.discountPrice?.message}
            >
              <input
                id="discountPrice"
                type="number"
                step="0.01"
                {...register("discountPrice")}
                className={errors.discountPrice ? inputErrorClass : inputClass}
              />
            </FormField>
            <FormField label="Currency" htmlFor="currency" error={errors.currency?.message}>
              <input
                id="currency"
                placeholder="USD"
                {...register("currency")}
                className={errors.currency ? inputErrorClass : inputClass}
              />
            </FormField>
          </FormSection>

          <FormSection title="Deal Information">
            <FormField
              label="Billing Type"
              htmlFor="billingType"
              error={errors.billingType?.message}
            >
              <select
                id="billingType"
                {...register("billingType")}
                className={errors.billingType ? inputErrorClass : inputClass}
              >
                <option value="">Select…</option>
                {BILLING_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Deal Type" htmlFor="dealType" error={errors.dealType?.message}>
              <select
                id="dealType"
                {...register("dealType")}
                className={errors.dealType ? inputErrorClass : inputClass}
              >
                <option value="">Select…</option>
                {DEAL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
          </FormSection>

          <FormSection title="Coupon">
            <FormField
              label="Coupon Code"
              htmlFor="couponCode"
              error={errors.couponCode?.message}
            >
              <input
                id="couponCode"
                {...register("couponCode")}
                className={errors.couponCode ? inputErrorClass : inputClass}
              />
            </FormField>
            <FormField
              label="Coupon Visibility"
              htmlFor="couponVisibility"
              error={errors.couponVisibility?.message}
            >
              <select
                id="couponVisibility"
                {...register("couponVisibility")}
                className={errors.couponVisibility ? inputErrorClass : inputClass}
              >
                {COUPON_VISIBILITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
          </FormSection>

          <FormSection title="Duration">
            <FormField label="Start Date" htmlFor="startDate" error={errors.startDate?.message}>
              <input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={errors.startDate ? inputErrorClass : inputClass}
              />
            </FormField>
            <FormField label="End Date" htmlFor="endDate" error={errors.endDate?.message}>
              <input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={errors.endDate ? inputErrorClass : inputClass}
              />
            </FormField>
          </FormSection>

          <FormSection title="Affiliate">
            <FormField
              label="Affiliate URL"
              htmlFor="affiliateUrl"
              error={errors.affiliateUrl?.message}
              fullWidth
            >
              <input
                id="affiliateUrl"
                {...register("affiliateUrl")}
                className={errors.affiliateUrl ? inputErrorClass : inputClass}
              />
            </FormField>
          </FormSection>

          <FormSection title="Description">
            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
              fullWidth
            >
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className={errors.description ? inputErrorClass : inputClass}
              />
            </FormField>
          </FormSection>

          <FormSection title="Cover Image">
            <div className="sm:col-span-2">
              <ImageUploadField
                currentImageUrl={coverImagePreview ?? deal.coverImage}
                onFileSelected={(file) => {
                  setCoverImageFile(file);
                  setCoverImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </FormSection>
        </div>
      </div>

      <StickyPublishBar
        onPublish={handlePublish}
        isPublishing={publishDraft.isPending}
        autoSaveStatus={autoSaveStatus}
        errorCount={Object.keys(errors).length}
      />
    </div>
  );
}
