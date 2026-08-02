import { BOOKING_STATUS, type BookingStatus } from "../types/booking.types";
import { STATUS_DISPLAY, TIMELINE_STAGES } from "../utils/booking.utils";

interface BookingTimelineProps {
  status: BookingStatus;
}

/**
 * Visual-only reflection of where a booking sits in its lifecycle. It does
 * not decide what's next or valid — that's entirely backend-owned (see
 * BOOKING_STATUS_TRANSITIONS in booking.constants.js).
 */
export function BookingTimeline({ status }: BookingTimelineProps) {
  if (status === BOOKING_STATUS.CANCELLED) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        This booking was cancelled.
      </div>
    );
  }

  const currentIndex = TIMELINE_STAGES.indexOf(status);

  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {TIMELINE_STAGES.map((stage, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={stage} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                } ${isCurrent ? "ring-2 ring-emerald-300 ring-offset-2" : ""}`}
              >
                {index + 1}
              </span>
              <span className={`text-xs ${isComplete ? "text-gray-900" : "text-gray-400"}`}>
                {STATUS_DISPLAY[stage].label}
              </span>
            </div>
            {index < TIMELINE_STAGES.length - 1 && (
              <span
                className={`mx-2 h-0.5 w-8 sm:w-12 ${index < currentIndex ? "bg-emerald-600" : "bg-gray-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
