import React from "react";
import { BRAND } from "./brand";

export const LogoMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill={BRAND.primary} />
    <text
      x="6"
      y="17"
      fontFamily="Inter, system-ui"
      fontSize="14"
      fill="white"
    >
      M
    </text>
  </svg>
);
