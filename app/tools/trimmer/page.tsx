import type { Metadata } from "next";
import { VideoTrimmer } from "@/components/tools/video-trimmer";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Video trimmer", description: "Trim a video and optionally remove audio, entirely in your browser." };
export default function VideoTrimmerPage() { return <ToolShell title="video trimmer" description="Trim a video locally with a browser-based FFmpeg workflow. The first load downloads the processing engine."><VideoTrimmer /></ToolShell>; }
