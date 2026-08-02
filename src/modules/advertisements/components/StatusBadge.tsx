import type { AdvertisementStatus } from "../types/advertisement.types";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "../utils/advertisement.utils";

interface StatusBadgeProps {
  status: AdvertisementStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};

export default StatusBadge;
