import type { Metadata } from "next";
import { GitDiffViewer } from "@/components/tools/text-tools";
import { ToolShell } from "@/components/tools/tool-shell";

export const metadata: Metadata = { title: "Git diff viewer", description: "Compare two text snippets with a git-style diff." };
export default function GitDiffViewerPage() { return <ToolShell title="git diff viewer" description="Compare two snippets and inspect the additions, removals, and context lines."><GitDiffViewer /></ToolShell>; }
