import React from "react";
export default function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={["h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:bg-gray-900 dark:border-gray-700", className].join(" ")} {...props}>{children}</select>;
}