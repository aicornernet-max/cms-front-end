import type { BookingStatus } from "../types/booking.types";
import { STATUS_DISPLAY } from "../utils/booking.utils";

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, badgeClassName } = STATUS_DISPLAY[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClassName}`}
    >
      {label}
    </span>
  );
}
