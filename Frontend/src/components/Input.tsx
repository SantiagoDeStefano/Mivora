import React from "react";
export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={["h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:bg-gray-900 dark:border-gray-700", className].join(" ")} {...props} />;
}