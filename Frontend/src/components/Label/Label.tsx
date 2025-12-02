import React from "react";
export default function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-200">{children}</label>;
}