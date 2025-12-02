import React from "react";
export default function Badge({ children, tone = "neutral", className = "" }: React.PropsWithChildren<{ tone?: "neutral"|"info"|"success"|"warn"|"pink"; className?: string }>) {
  const map = {
    neutral: "bg-gray-800 text-gray-200",
    info: "bg-blue-900/30 text-blue-300",
    success: "bg-emerald-900/30 text-emerald-300",
    warn: "bg-amber-900/30 text-amber-300",
    pink: "bg-pink-900/30 text-pink-300",
  } as const;
  return <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-medium", map[tone], className].join(" ")}>{children}</span>;
}