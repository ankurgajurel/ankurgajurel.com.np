import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ToolButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "quiet";
  children: ReactNode;
};

export function ToolButton({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: ToolButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border border-foreground/15 bg-background text-foreground hover:bg-card",
    danger:
      "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20",
    quiet: "text-foreground/65 hover:bg-card hover:text-foreground",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 px-3 py-2 text-sm transition-colors disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
