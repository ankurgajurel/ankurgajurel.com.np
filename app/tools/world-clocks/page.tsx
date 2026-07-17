import { Suspense } from "react";
import type { Metadata } from "next";
import { WorldClocks } from "@/components/tools/time-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "World clocks", description: "Convert time zones and keep a set of live world clocks." };
export default function WorldClocksPage() { return <ToolShell title="world clocks" description="Convert a time between zones and keep the cities you work with close at hand."><Suspense fallback={<p>Loading clocks…</p>}><WorldClocks /></Suspense></ToolShell>; }
