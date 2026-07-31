import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { EMPTY_DEALS_FILTERS, type DealsFilterState } from "../types";

interface DealsFiltersProps {
  filters: DealsFilterState;
  onApply: (filters: DealsFilterState) => void;
  onReset: () => void;
}

const selectClasses =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const labelClasses = "mb-1.5 block text-xs font-medium text-gray-500";

export const DealsFilters = ({ filters, onApply, onReset }: DealsFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Draft state so edits only take effect on "Apply Filters" —
  // no backend call happens yet either way (see requirements).
  const [draft, setDraft] = useState<DealsFilterState>(filters);

  const update = (patch: Partial<DealsFilterState>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const handleReset = () => {
    setDraft(EMPTY_DEALS_FILTERS);
    onReset();
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" aria-hidden="true" />
          Filters
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClasses}>Status</label>
              <select
                className={selectClasses}
                value={draft.status}
                onChange={(e) => update({ status: e.target.value as DealsFilterState["status"] })}
              >
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Deal Type</label>
              <select
                className={selectClasses}
                value={draft.dealType}
                onChange={(e) => update({ dealType: e.target.value })}
              >
                <option value="">All deal types</option>
                <option value="discount">Discount</option>
                <option value="freebie">Freebie</option>
                <option value="bundle">Bundle</option>
                <option value="trial">Trial</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Billing Type</label>
              <select
                className={selectClasses}
                value={draft.billingType}
                onChange={(e) => update({ billingType: e.target.value })}
              >
                <option value="">All billing types</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
                <option value="one_time">One-time</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Tool</label>
              {/* Free-text for now — swap for an async tool-select once a
                  tools lookup endpoint is wired into this filter. */}
              <input
                type="text"
                value={draft.toolId}
                onChange={(e) => update({ toolId: e.target.value })}
                placeholder="Filter by tool"
                className={selectClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Coupon Visibility</label>
              <select
                className={selectClasses}
                value={draft.couponVisibility}
                onChange={(e) =>
                  update({ couponVisibility: e.target.value as DealsFilterState["couponVisibility"] })
                }
              >
                <option value="">All</option>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Start Date</label>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => update({ startDate: e.target.value })}
                className={selectClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>End Date</label>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => update({ endDate: e.target.value })}
                className={selectClasses}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => onApply(draft)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
