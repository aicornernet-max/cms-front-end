import { formatDateForCsv } from "./formatDate";
import type { SubscriberWithMeta } from "../types/subscriber.types";

function escapeCsvValue(value: string): string {
  const needsQuoting = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

/**
 * Builds a CSV string from the given subscribers and triggers a browser
 * download. Entirely client-side — no backend endpoint involved.
 */
export function exportSubscribersToCsv(subscribers: SubscriberWithMeta[]): void {
  const headers = ["Email", "Device", "Browser", "IP", "Created Date"];

  const rows = subscribers.map((subscriber) =>
    [
      subscriber.email,
      subscriber.device,
      subscriber.browser,
      subscriber.ipAddress || "",
      formatDateForCsv(subscriber.createdAt),
    ]
      .map((value) => escapeCsvValue(String(value)))
      .join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
