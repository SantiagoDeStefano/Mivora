import React from "react";
import { BRAND } from "../../constants/brand";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const variants = {
    primary: `
      bg-[${BRAND.primary}] 
      text-white 
      hover:opacity-90 
      focus-visible:ring-[${BRAND.primary}] 
      disabled:opacity-60
    `,
    secondary: `
      bg-gray-900 text-gray-200 border border-gray-700
      hover:bg-gray-800
    `,
    ghost: `
      bg-transparent text-gray-200 hover:bg-gray-800
    `,
    destructive: `
      bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500
    `,
  } as const;

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-lg",
    md: "h-10 px-4 text-sm rounded-xl",
    lg: "h-12 px-5 text-base rounded-2xl",
  } as const;

  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      style={
        variant === "primary"
          ? { backgroundColor: BRAND.primary }
          : undefined
      }
    >
      {children}
    </button>
  );
};

export default Button; 
