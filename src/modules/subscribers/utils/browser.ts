import type { BrowserType } from "../types/subscriber.types";

/**
 * Detects the browser (or client) from a raw User-Agent string.
 * Order matters: Edge and Chrome both contain "chrome" in their UA string,
 * so more specific checks must run first.
 */
export function detectBrowser(userAgent: string | undefined | null): BrowserType {
  if (!userAgent) return "Unknown";

  const ua = userAgent.toLowerCase();

  if (ua.includes("postman")) return "Postman";
  if (ua.includes("edg/") || ua.includes("edge/")) return "Edge";
  if (ua.includes("firefox/") || ua.includes("fxios/")) return "Firefox";
  if (ua.includes("chrome/") || ua.includes("crios/")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome")) return "Safari";

  return "Unknown";
}

/**
 * Tailwind color classes for each browser badge.
 * Kept in this file so table/row components stay presentation-only.
 */
export const browserBadgeClasses: Record<BrowserType, string> = {
  Chrome: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Firefox: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  Safari: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  Edge: "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200",
  Postman: "bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-300",
  Unknown: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
};


