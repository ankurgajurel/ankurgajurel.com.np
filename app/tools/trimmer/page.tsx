import type { Metadata } from "next";
import { VideoTrimmer } from "@/components/tools/video-trimmer";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = {
  title: "Video trimmer",
  description:
    "Trim a video and optionally remove audio, entirely in your browser.",
};
export default function VideoTrimmerPage() {
  return (
    <ToolShell
      reloadNavigation
      title="video trimmer"
      description="Trim a video entirely in your browser. The processing engine downloads when you first trim a video."
    >
      <VideoTrimmer />
    </ToolShell>
  );
}
