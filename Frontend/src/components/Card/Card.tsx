import React from "react";
export function Surface({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        'rounded-2xl shadow-sm',
        // explicit light/dark border and background
        'border border-gray-200 bg-white',
        'dark:border-gray-800 dark:bg-gray-900/70',
        className
      ].join(' ')}
    >
      {children}
    </div>
  )
}
export default function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <Surface className={["p-5", className].join(" ")}>{children}</Surface>;
}
