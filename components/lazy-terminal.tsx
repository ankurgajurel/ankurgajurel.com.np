"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useConsoleVisibleStore } from "@/store/console";

const Terminal = dynamic(() => import("./terminal"), { ssr: false });

export default function LazyTerminal() {
  const isVisible = useConsoleVisibleStore((state) => state.isVisible);
  const [hasOpened, setHasOpened] = useState(false);
  if (isVisible && !hasOpened) setHasOpened(true);
  // Keep command history when closing and reopening the console.
  return hasOpened ? <Terminal /> : null;
}
