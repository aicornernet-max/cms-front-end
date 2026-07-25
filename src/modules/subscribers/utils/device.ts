import type { DeviceType } from "../types/subscriber.types";

/**
 * Detects the device type from a raw User-Agent string.
 * Falls back to "Unknown" when the pattern cannot be determined.
 */
export function detectDevice(userAgent: string | undefined | null): DeviceType {
  if (!userAgent) return "Unknown";

  const ua = userAgent.toLowerCase();

  // Common API / testing clients
  if (
    ua.includes("postman") ||
    ua.includes("insomnia") ||
    ua.includes("curl") ||
    ua.includes("axios") ||
    ua.includes("okhttp") ||
    ua.includes("python-requests")
  ) {
    return "API";
  }

  // Bots / crawlers
  if (
    ua.includes("bot") ||
    ua.includes("spider") ||
    ua.includes("crawler") ||
    ua.includes("slurp") ||
    ua.includes("facebookexternalhit") ||
    ua.includes("googlebot")
  ) {
    return "Bot";
  }

  // Tablets (must be checked before generic mobile check)
  if (
    ua.includes("ipad") ||
    (ua.includes("android") && !ua.includes("mobile")) ||
    ua.includes("tablet") ||
    ua.includes("kindle") ||
    ua.includes("playbook")
  ) {
    return "Tablet";
  }

  // Mobile devices
  if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    (ua.includes("android") && ua.includes("mobile")) ||
    ua.includes("blackberry") ||
    ua.includes("windows phone")
  ) {
    return "Mobile";
  }

  // Desktop indicators
  if (
    ua.includes("windows") ||
    ua.includes("macintosh") ||
    ua.includes("mac os") ||
    ua.includes("linux") ||
    ua.includes("x11")
  ) {
    return "Desktop";
  }

  return "Unknown";
}

/**
 * Tailwind color classes for each device badge.
 */
export const deviceBadgeClasses: Record<DeviceType, string> = {
  Desktop: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  Mobile: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  Tablet: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  API: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  Bot: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  Unknown: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
};
