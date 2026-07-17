import { Suspense } from "react";
import type { Metadata } from "next";
import { WhoisLookup } from "@/components/tools/network-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "WHOIS lookup", description: "Look up public domain registration information." };
export default function WhoisLookupPage() { return <ToolShell title="whois lookup" description="Look up the public registration record for a domain."><Suspense fallback={<p>Loading lookup…</p>}><WhoisLookup /></Suspense></ToolShell>; }
