import { forwardRef, InputHTMLAttributes, ReactNode, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, icon, type = "text", className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isPassword = type === "password";
    const [show, setShow] = useState(false);
    const effectiveType = isPassword ? (show ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "flex h-12 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/70",
              "transition-smooth focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              isPassword && "pr-11",
              error && "border-destructive focus:border-destructive focus:ring-destructive/10",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-smooth hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

InputField.displayName = "InputField";
export default InputField;
