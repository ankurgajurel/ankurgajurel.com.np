"use client";

import { MoonIcon } from "@phosphor-icons/react/dist/ssr/Moon";
import { SunIcon } from "@phosphor-icons/react/dist/ssr/Sun";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      className="inline-flex size-[34px] items-center justify-center rounded-full text-secondary-foreground [corner-shape:round] transition-[background,transform,scale] duration-160 ease-[ease,var(--ease),var(--ease)] aria-pressed:bg-card active:scale-[0.94] pointer-fine:hover:bg-card"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="toggle color theme"
      title="toggle color theme"
    >
      <MoonIcon
        size={18}
        weight="light"
        className="dark:hidden"
        aria-hidden="true"
      />
      <SunIcon
        size={18}
        weight="light"
        className="hidden dark:block"
        aria-hidden="true"
      />
    </button>
  );
}
