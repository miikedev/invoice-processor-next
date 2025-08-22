import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString)

  // Example: "Aug 20, 2025, 1:26 PM"
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",  // "Jan", "Feb", "Aug"
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}