import React from "react";
export function Badge({ children, tone = "neutral", className = "" }: React.PropsWithChildren<{ tone?: "neutral"|"info"|"success"|"warn"|"pink"; className?: string }>) {
  const map = {
    neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    warn: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  } as const;
  return <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-medium", map[tone], className].join(" ")}>{children}</span>;
}