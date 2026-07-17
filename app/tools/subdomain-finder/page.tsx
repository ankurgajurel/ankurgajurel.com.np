import { Suspense } from "react";
import type { Metadata } from "next";
import { SubdomainFinder } from "@/components/tools/network-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Subdomain finder", description: "Find public Certificate Transparency records for a domain." };
export default function SubdomainFinderPage() { return <ToolShell title="subdomain finder" description="Find names that appeared in public Certificate Transparency logs."><Suspense fallback={<p>Loading finder…</p>}><SubdomainFinder /></Suspense></ToolShell>; }
