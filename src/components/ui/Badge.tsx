import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "owner" | "admin" | "member" | "success" | "warning" | "error";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-container text-on-surface-variant",
  owner: "bg-primary text-on-primary",
  admin: "bg-secondary-container text-on-secondary-container",
  member: "bg-surface-container-high text-on-surface-variant",
  success: "bg-primary-fixed text-on-primary-fixed",
  warning: "bg-secondary-fixed text-on-secondary-fixed",
  error: "bg-error-container text-on-error-container",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-label-caps font-sans ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
