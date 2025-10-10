import React from "react";
export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">{children}</label>;
}