import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
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

export function matchStatusText(status: string, minute: number): string {
  switch (status) {
    case "LIVE": return minute > 90 ? `${minute}'` : `${minute}'`;
    case "SCHEDULED": return "لم تبدأ";
    case "FINISHED": return "انتهت";
    case "POSTPONED": return "مؤجلة";
    case "CANCELLED": return "ملغية";
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
