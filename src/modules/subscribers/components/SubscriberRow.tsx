import { memo } from "react";
import { Trash2 } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { deviceBadgeClasses } from "../utils/device";
import { browserBadgeClasses } from "../utils/browser";
import type { SubscriberWithMeta } from "../types/subscriber.types";

export interface SubscriberRowProps {
  subscriber: SubscriberWithMeta;
  onDeleteRequest: (subscriber: SubscriberWithMeta) => void;
}

/**
 * Desktop / tablet table row.
 * Rendered only inside a <tbody>, so it must return a single <tr>
 * to keep the HTML valid.
 */
function SubscriberTableRowComponent({ subscriber, onDeleteRequest }: SubscriberRowProps) {
  const { date, time } = formatDate(subscriber.createdAt);

  return (
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 sm:px-6">
        {subscriber.email}
      </td>
      <td className="whitespace-nowrap px-4 py-4 sm:px-6">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${deviceBadgeClasses[subscriber.device]}`}
        >
          {subscriber.device}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-4 sm:px-6">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${browserBadgeClasses[subscriber.browser]}`}
        >
          {subscriber.browser}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 sm:px-6">
        {subscriber.ipAddress || "-"}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 sm:px-6">
        <div>{date}</div>
        <div className="text-xs text-gray-400">{time}</div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-right text-sm sm:px-6">
        <button
          type="button"
          onClick={() => onDeleteRequest(subscriber)}
          aria-label={`Delete subscriber ${subscriber.email}`}
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

/**
 * Mobile card layout. Used outside the <table> entirely (see SubscriberTable),
 * so it's free to render a <div>.
 */
function SubscriberCardComponent({ subscriber, onDeleteRequest }: SubscriberRowProps) {
  const { date, time } = formatDate(subscriber.createdAt);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="break-all text-sm font-medium text-gray-900">
          {subscriber.email}
        </p>
        <button
          type="button"
          onClick={() => onDeleteRequest(subscriber)}
          aria-label={`Delete subscriber ${subscriber.email}`}
          className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${deviceBadgeClasses[subscriber.device]}`}
        >
          {subscriber.device}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${browserBadgeClasses[subscriber.browser]}`}
        >
          {subscriber.browser}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>
          <dt className="text-gray-400">IP Address</dt>
          <dd className="mt-0.5 text-gray-700">{subscriber.ipAddress || "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Subscribed</dt>
          <dd className="mt-0.5 text-gray-700">
            {date} &middot; {time}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export const SubscriberTableRow = memo(SubscriberTableRowComponent);
export const SubscriberCard = memo(SubscriberCardComponent);

// Default export kept as the table row for convenience / naming parity with the file name.
export default SubscriberTableRow;
