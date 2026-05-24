import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Locale = "ar" | "en";

export function formatDate(date: Date | string, locale: Locale = "ar"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: Date | string, locale: Locale = "ar"): string {
  const d = new Date(date);
  return d.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string, locale: Locale = "ar"): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
}

export function getTimeRemaining(date: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = new Date(date).getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, total };
}

export function matchStatusText(status: string, minute: number, locale: Locale = "ar"): string {
  switch (status) {
    case "LIVE": return minute > 90 ? `${minute}'` : `${minute}'`;
    case "SCHEDULED": return locale === "ar" ? "لم تبدأ" : "Scheduled";
    case "FINISHED": return locale === "ar" ? "انتهت" : "Finished";
    case "POSTPONED": return locale === "ar" ? "مؤجلة" : "Postponed";
    case "CANCELLED": return locale === "ar" ? "ملغية" : "Cancelled";
    default: return status;
  }
}

export function matchStatusColor(status: string): string {
  switch (status) {
    case "LIVE": return "text-red-500";
    case "FINISHED": return "text-gray-500";
    case "SCHEDULED": return "text-blue-500";
    default: return "text-yellow-500";
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getImageUrl(url: string | null | undefined, fallback: string = "/images/placeholder.svg"): string {
  return url || fallback;
}

export function getTeamInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getMatchMinute(minute: number, status: string): string {
  if (status !== "LIVE") return "";
  if (minute > 90) return `${minute}+'`;
  return `${minute}'`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
