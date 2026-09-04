import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
}
const buttonVariants = cva(
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs transition-[background-color,color,transform,scale] active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
export default function Button({
  children,
  variant = "default",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(buttonVariants({ variant }), className)}
    >
      {children}
    </button>
  );
}
