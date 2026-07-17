import { Suspense } from "react";
import type { Metadata } from "next";
import { ScreenTester } from "@/components/tools/time-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Test screens", description: "Preview a URL at common laptop and phone aspect ratios." };
export default function TestScreensPage() { return <ToolShell title="test screens" description="Load a URL and inspect it through common laptop and phone viewports."><Suspense fallback={<p>Loading preview…</p>}><ScreenTester /></Suspense></ToolShell>; }
