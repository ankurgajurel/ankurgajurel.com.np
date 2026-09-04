"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TerminalWindowIcon } from "@phosphor-icons/react/dist/ssr/TerminalWindow";
import { useConsoleVisibleStore } from "@/store/console";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "writing", href: "/blog" },
  { label: "gallery", href: "/gallery" },
  { label: "tools", href: "/tools" },
];

export default function Navbar() {
  const pathname = usePathname();
  const NavLink = pathname === "/tools/trimmer" ? "a" : Link;
  const { isVisible, setIsVisible } = useConsoleVisibleStore();
  return (
    <>
      <a
        href="#main-content"
        className="fixed -top-15 left-4 z-100 rounded-[10px] bg-foreground px-4 py-2.5 text-background focus:top-3"
      >
        skip to content
      </a>
      <header className="sticky top-0 z-40 shrink-0 bg-background/88 backdrop-blur-[16px]">
        <div className="m-auto flex min-h-[82px] w-[min(800px,calc(100%-40px))] items-center gap-[42px] [@media(max-width:640px)]:grid [@media(max-width:640px)]:grid-cols-[1fr_auto] [@media(max-width:640px)]:gap-0 [@media(max-width:640px)]:pt-[9px]">
          <NavLink
            href="/"
            className="py-1.5 pr-1 text-[22px] font-[550] tracking-[-0.08em] [&_span]:text-muted-foreground [@media(max-width:640px)]:w-fit"
            aria-label="ankur gajurel — home"
          >
            ag<span>.</span>
          </NavLink>
          <nav
            className="flex items-center gap-[25px] [@media(max-width:640px)]:col-span-full [@media(max-width:640px)]:row-start-2 [@media(max-width:640px)]:justify-between [@media(max-width:640px)]:gap-4"
            aria-label="main navigation"
          >
            {links.map(({ label, href }) => {
              const active =
                href === "/"
                  ? pathname === "/" || pathname === "/demo"
                  : pathname.startsWith(href);
              return (
                <NavLink
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="relative py-3.5 text-[14px] leading-[1.4] text-muted-foreground transition-[color] duration-160 ease-[ease] after:absolute after:bottom-3.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-200 after:ease-portfolio after:content-[''] aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100 pointer-fine:hover:text-foreground pointer-fine:hover:after:scale-x-100 [@media(max-width:640px)]:pt-2.5 [@media(max-width:640px)]:pb-[15px] [@media(max-width:640px)]:after:bottom-[15px]"
                >
                  {label}
                </NavLink>
              );
            })}
          </nav>
          <div className="ml-auto flex gap-1 [@media(max-width:640px)]:col-start-2 [@media(max-width:640px)]:row-start-1">
            <ThemeToggle />
            <button
              className="inline-flex size-[34px] items-center justify-center rounded-full text-secondary-foreground [corner-shape:round] transition-[background,transform,scale] duration-160 ease-[ease,var(--ease),var(--ease)] aria-pressed:bg-card active:scale-[0.94] pointer-fine:hover:bg-card"
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? "close console" : "open console"}
              aria-pressed={isVisible}
              title="console"
            >
              <TerminalWindowIcon size={18} weight="light" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
