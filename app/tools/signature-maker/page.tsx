import type { Metadata } from "next";
import { SignatureMaker } from "@/components/tools/media-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Signature maker", description: "Draw and download a transparent PNG signature." };

export default function SignatureMakerPage() {
  return <ToolShell title="signature maker" description="Draw with a mouse, finger, or stylus and export a transparent PNG."><SignatureMaker /></ToolShell>;
}
