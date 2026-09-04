"use client";
import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { CopySimpleIcon } from "@phosphor-icons/react/dist/ssr/CopySimple";
import { user } from "@/data/general";

export default function CopyEmail() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        user.socials.mail.replace("mailto:", ""),
      );
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  return (
    <button
      className="inline-flex min-h-9 items-center gap-[7px] text-[13px] text-muted-foreground pointer-fine:hover:text-foreground"
      onClick={copy}
    >
      {status === "copied" ? (
        <CheckIcon size={14} />
      ) : (
        <CopySimpleIcon size={14} />
      )}
      <span aria-live="polite">
        {status === "copied"
          ? "email copied"
          : status === "error"
            ? "use the email link"
            : "copy email"}
      </span>
    </button>
  );
}
