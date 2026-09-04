import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
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
    <main
      id="main-content"
      className={cn(
        "mx-auto w-[min(900px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12",
        className,
      )}
    >
      <Link
        href="/tools"
        className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
      >
        <ArrowLeftIcon size={14} aria-hidden="true" />
        all tools
      </Link>
      <header className="mb-[38px] [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-[28px] [&_h1]:font-[450] [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.045em] [&_h1>span]:ml-3 [&_h1>span]:align-middle [&_h1>span]:text-[14px] [&_h1>span]:font-normal [&_h1>span]:tracking-normal [&_h1>span]:text-muted-foreground [&>p:last-child]:max-w-[490px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-secondary-foreground mt-[30px]">
        <h1>{title.toLowerCase()}</h1>
        <p>{description.toLowerCase()}</p>
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
        "rounded-3xl [corner-shape:squircle] border border-border bg-card p-4 sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
export const toolInputClassName =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15";
export const toolLabelClassName =
  "mb-2 block text-xs font-medium lowercase text-muted-foreground";
