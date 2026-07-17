import type { Metadata } from "next";
import { ImageCompressor } from "@/components/tools/media-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Image compressor", description: "Resize and re-encode images locally in your browser." };

export default function ImageCompressorPage() {
  return <ToolShell title="image compressor" description="Resize and re-encode images without uploading them anywhere."><ImageCompressor /></ToolShell>;
}
