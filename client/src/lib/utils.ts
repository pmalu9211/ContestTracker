import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatContestTime(date: Date) {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function getContestDuration(startTime: Date, endTime: Date) {
  const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
