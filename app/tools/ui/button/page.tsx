import type { Metadata } from "next";
import { ButtonShowcase } from "@/components/tools/ui-showcase";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Mero UI button", description: "Button component reference." };
export default function MeroUiButtonPage() { return <ToolShell title="button" description="Action states and usage for the portfolio's current button style."><ButtonShowcase /></ToolShell>; }
