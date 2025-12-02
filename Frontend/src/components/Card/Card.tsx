import React from "react";
export function Surface({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        'rounded-2xl shadow-sm',
        // use dark-style as default
        'border border-gray-800 bg-gray-900/70',
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
