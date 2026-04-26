import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  padding = "lg",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-outline-variant ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
