import React from "react";
export function Surface({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["rounded-2xl border bg-white shadow-sm dark:bg-gray-900/70 dark:border-gray-800", className].join(" ")}>{children}</div>;
}
export default function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <Surface className={["p-5", className].join(" ")}>{children}</Surface>;
}
