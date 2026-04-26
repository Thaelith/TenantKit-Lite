import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-sm text-on-surface font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-colors ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-body-sm text-error">{error}</p>
      )}
    </div>
  );
}
