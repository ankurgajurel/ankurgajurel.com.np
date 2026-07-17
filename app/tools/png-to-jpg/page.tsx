import type { Metadata } from "next";
import { PngToJpg } from "@/components/tools/media-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "PNG to JPG", description: "Convert PNG files to JPG locally in your browser." };

export default function PngToJpgPage() {
  return <ToolShell title="png to jpg" description="Flatten a PNG onto white and export a smaller JPG with adjustable quality."><PngToJpg /></ToolShell>;
}
