import { format, isBefore, isToday, parseISO, formatDistanceToNow } from "date-fns";

export function formatDueDate(dueDate) {
  if (!dueDate) return "No due date";
  const date = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;

  const now = new Date();
  const overdue = isBefore(date, now) && !isToday(date);

  const human = formatDistanceToNow(date, { addSuffix: true });
  const absolute = format(date, "dd MMM yyyy");

  if (overdue) {
    return `Overdue • ${absolute} (${human})`;
  }
  return `Due • ${absolute} (${human})`;
}