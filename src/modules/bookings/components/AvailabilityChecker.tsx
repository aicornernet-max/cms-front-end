import { useCheckAvailability } from "../hooks/useCheckAvailability";
import type { CheckAvailabilityPayload, SuggestedSlot } from "../types/booking.types";
import { SuggestedSlotsList } from "./SuggestedSlotsList";

interface AvailabilityCheckerProps {
  payload: CheckAvailabilityPayload | null;
  onSelectSlot: (slot: SuggestedSlot) => void;
}

/**
 * Purely a thin wrapper around POST /check-availability. All availability
 * and overlap logic lives on the backend — this component only triggers the
 * call and renders whatever it returns.
 */
export function AvailabilityChecker({ payload, onSelectSlot }: AvailabilityCheckerProps) {
  const checkAvailability = useCheckAvailability();

  const handleCheck = () => {
    if (!payload) return;
    checkAvailability.mutate(payload);
  };

  const result = checkAvailability.data;

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Availability</p>
          <p className="text-xs text-gray-500">Checked against the backend before the booking is created.</p>
        </div>
        <button
          type="button"
          onClick={handleCheck}
          disabled={!payload || checkAvailability.isPending}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checkAvailability.isPending ? "Checking…" : "Check availability"}
        </button>
      </div>

      {result && (
        <div className="mt-3">
          {result.available ? (
            <p className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700">
              Available
            </p>
          ) : (
            <>
              <p className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-sm font-medium text-red-700">
                Conflict — this slot is already booked
              </p>
              <SuggestedSlotsList slots={result.suggestedSlots ?? []} onSelect={onSelectSlot} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
