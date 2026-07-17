import { Suspense } from "react";
import type { Metadata } from "next";
import { OpenGraphInspector } from "@/components/tools/network-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Open graph inspector", description: "Inspect raw metadata and social link previews for a URL." };
export default function OpenGraphPage() { return <ToolShell title="open graph inspector" description="Fetch a public page, inspect its metadata, and preview its social cards."><Suspense fallback={<p>Loading inspector…</p>}><OpenGraphInspector /></Suspense></ToolShell>; }
