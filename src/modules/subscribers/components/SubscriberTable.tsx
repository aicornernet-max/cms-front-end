import { SubscriberTableRow, SubscriberCard } from "./SubscriberRow";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";
import type { SubscriberWithMeta } from "../types/subscriber.types";

interface SubscriberTableProps {
  subscribers: SubscriberWithMeta[];
  isLoading: boolean;
  onDeleteRequest: (subscriber: SubscriberWithMeta) => void;
}

const COLUMNS = [
  "Email",
  "Device",
  "Browser",
  "IP Address",
  "Subscribed Date",
  "Actions",
];

export default function SubscriberTable({
  subscribers,
  isLoading,
  onDeleteRequest,
}: SubscriberTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <LoadingSkeleton />
      </div>
    );
  }

  if (subscribers.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Desktop / tablet: table, horizontally scrollable on smaller viewports */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm sm:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-6 ${
                    column === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.map((subscriber) => (
              <SubscriberTableRow
                key={subscriber._id}
                subscriber={subscriber}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards instead of a squeezed table */}
      <div className="flex flex-col gap-3 sm:hidden">
        {subscribers.map((subscriber) => (
          <SubscriberCard
            key={subscriber._id}
            subscriber={subscriber}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
      </div>
    </>
  );
}
