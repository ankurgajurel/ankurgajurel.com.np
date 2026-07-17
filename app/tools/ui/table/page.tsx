import type { Metadata } from "next";
import { TableShowcase } from "@/components/tools/ui-showcase";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Mero UI table", description: "Table component reference." };
export default function MeroUiTablePage() { return <ToolShell title="table" description="A compact data table that matches the portfolio's existing utility sections."><TableShowcase /></ToolShell>; }
