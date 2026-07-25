/**
 * Formats an ISO date string into a two-line readable format:
 * "24 Jul 2026" and "10:48 AM"
 */
export function formatDate(dateString: string | undefined | null): {
  date: string;
  time: string;
  full: string;
} {
  if (!dateString) {
    return { date: "-", time: "", full: "-" };
  }

  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "-", time: "", full: "-" };
  }

  const date = parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time, full: `${date}, ${time}` };
}

/**
 * Formats a date for CSV export (single line, unambiguous).
 */
export function formatDateForCsv(dateString: string | undefined | null): string {
  if (!dateString) return "";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString();
}
