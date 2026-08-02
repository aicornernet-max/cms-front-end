import type { Advertisement } from "../types/advertisement.types";
import {
  formatDateTimeUtc,
  formatPercentage,
} from "../utils/advertisement.utils";

interface AdvertisementReadOnlyInfoProps {
  advertisement: Advertisement;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

const AdvertisementReadOnlyInfo = ({
  advertisement,
}: AdvertisementReadOnlyInfoProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Booking &amp; Vendor Snapshot
      </h3>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="Booking" value={advertisement.booking.bookingNumber} />
        <Field label="Vendor" value={advertisement.vendor.companyName} />
        <Field label="Version" value={`v${advertisement.version}`} />
        <Field
          label="Parent Version"
          value={
            advertisement.parentVersion
              ? `v${advertisement.parentVersion}`
              : "-"
          }
        />
        <Field
          label="UTC Start"
          value={formatDateTimeUtc(advertisement.utcStartDate)}
        />
        <Field
          label="UTC End"
          value={formatDateTimeUtc(advertisement.utcEndDate)}
        />
        <Field
          label="Offer Percentage"
          value={formatPercentage(advertisement.offerPercentage)}
        />
      </dl>
    </div>
  );
};

export default AdvertisementReadOnlyInfo;
