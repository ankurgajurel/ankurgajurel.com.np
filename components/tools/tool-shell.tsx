import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ToolShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function ToolShell({
  title,
  description,
  children,
  className,
}: ToolShellProps) {
  return (
    <main className={cn("container px-4 py-10 sm:py-14", className)}>
      <Link
        href="/tools"
        className="group mb-10 inline-flex items-center gap-2 text-sm text-foreground/65 transition-colors hover:text-foreground"
      >
        <span>/ tools</span>
        <ArrowUpRight
          aria-hidden="true"
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-base text-foreground/65 sm:text-lg">
          {description}
        </p>
      </header>
      {children}
    </main>
  );
}

export function ToolPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border border-foreground/10 bg-card p-4 shadow-sm sm:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

export const toolInputClassName =
  "w-full border border-foreground/15 bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground/45";

export const toolLabelClassName = "mb-2 block text-xs font-medium uppercase tracking-wide text-foreground/65";
