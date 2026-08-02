import type { SuggestedSlot } from "../types/booking.types";
import { formatDuration } from "../utils/booking.utils";

interface SuggestedSlotsListProps {
  slots: SuggestedSlot[];
  onSelect: (slot: SuggestedSlot) => void;
}

export function SuggestedSlotsList({ slots, onSelect }: SuggestedSlotsListProps) {
  if (slots.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700">Suggested slots</p>
      <ul className="mt-2 flex flex-col gap-2">
        {slots.map((slot) => (
          <li key={`${slot.startUtc}-${slot.endUtc}`}>
            <button
              type="button"
              onClick={() => onSelect(slot)}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left text-sm hover:border-gray-400 hover:bg-gray-50"
            >
              <span className="text-gray-900">
                {slot.localStartDate} {slot.localStartTime} → {slot.localEndDate} {slot.localEndTime}
              </span>
              <span className="text-xs text-gray-500">{formatDuration(slot.durationHours)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
