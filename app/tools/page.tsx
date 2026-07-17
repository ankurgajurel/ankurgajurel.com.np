import type { Metadata } from "next";
import { ToolsDirectory } from "@/components/tools/tools-directory";

export const metadata: Metadata = {
  title: "Tools",
  description: "A collection of browser-first tools by Ankur Gajurel.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
