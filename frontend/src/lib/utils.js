import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getDueDateStatus(dueDate, status) {
  if (!dueDate || status === "done") return null;
  const now = new Date();
  const due = new Date(dueDate);

  // Set both dates to start of day for accurate comparison
  const nowStartOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const dueStartOfDay = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate(),
  );

  // Calculate difference in days
  const diffDays = Math.floor(
    (dueStartOfDay - nowStartOfDay) / (1000 * 60 * 60 * 24),
  );

  // Overdue if on due date or past due date
  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  return "ok";
}

export function statusLabel(status) {
  const map = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
  return map[status] || status;
}

export function statusColor(status) {
  const map = {
    todo: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    "in-progress":
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    done: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  };
  return map[status] || "";
}
