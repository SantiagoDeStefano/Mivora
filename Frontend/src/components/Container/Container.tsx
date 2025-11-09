import React from "react";

type ContainerProps = React.PropsWithChildren<{
  className?: string;
  /** max width token; defaults to 7xl */
  max?: "5xl" | "6xl" | "7xl" | "full";
  /** remove side padding and allow content to bleed to edges */
  bleed?: boolean;
}>;

const Container: React.FC<ContainerProps> = ({
  className = "",
  children,
  max = "7xl",
  bleed = false,
}) => {
  const maxClass = max === "full" ? "max-w-full" : `max-w-${max}`;
  const padClass = bleed ? "px-0" : "px-4 sm:px-6 lg:px-8";
  return <div className={["mx-auto", maxClass, padClass, className].join(" ")}>{children}</div>;
};

export default Container;