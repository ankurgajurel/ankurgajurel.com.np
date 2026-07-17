import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Mero UI", description: "The small component reference that was part of the original tools site." };
const components = [{ name: "button", description: "The primary action treatment used across the portfolio.", href: "/tools/ui/button" }, { name: "table", description: "The simple data table pattern used in portfolio sections.", href: "/tools/ui/table" }];
export default function MeroUiPage() { return <ToolShell title="mero ui" description="A small reference for the original tools site's reusable controls, now expressed with this portfolio's components."><div className="border-t border-foreground/10">{components.map((component) => <Link key={component.name} href={component.href} className="table-border group grid gap-2 py-4 sm:grid-cols-[12rem_1fr_auto] sm:items-center sm:px-2"><h2 className="text-lg">{component.name}</h2><p className="text-sm text-foreground/60">{component.description}</p><ArrowUpRight size={18} className="justify-self-end transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}</div></ToolShell>; }
