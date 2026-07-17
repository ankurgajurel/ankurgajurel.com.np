import type { Metadata } from "next";
import { ColorConverter } from "@/components/tools/text-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Color converter", description: "Convert color values across a CSS file." };
export default function ColorConverterPage() { return <ToolShell title="color converter" description="Convert every hex, RGB, HSL, or OKLCH color in a CSS snippet."><ColorConverter /></ToolShell>; }
