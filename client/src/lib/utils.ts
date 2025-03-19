import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { type Contest } from "@shared/schema";

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

export function generateGoogleCalendarUrl(contest: Contest) {
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  const formatDate = (date: Date) => 
    date.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${contest.name} - ${contest.platform}`,
    details: `Programming contest on ${contest.platform}.\nRegister here: ${contest.url}`,
    dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function sortContests(contests: Contest[], sortBy: string) {
  return [...contests].sort((a, b) => {
    switch (sortBy) {
      case "platform":
        return a.platform.localeCompare(b.platform);
      case "duration":
        return (b.endTime.getTime() - b.startTime.getTime()) - 
               (a.endTime.getTime() - a.startTime.getTime());
      case "time":
      default:
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
  });
}