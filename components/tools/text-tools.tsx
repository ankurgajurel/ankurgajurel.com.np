"use client";

import { useState } from "react";
import { ArrowsLeftRightIcon as ArrowLeftRight } from "@phosphor-icons/react/dist/ssr/ArrowsLeftRight";
import { GitDiffIcon as GitCompareArrows } from "@phosphor-icons/react/dist/ssr/GitDiff";
import { convertCssColors, type ColorFormat } from "@/lib/tools/color";
import { generateDiff } from "@/lib/tools/diff";
import { ToolButton } from "@/components/tools/tool-button";
import { ToolPanel, toolInputClassName, toolLabelClassName } from "@/components/tools/tool-shell";

const textarea = `${toolInputClassName} min-h-64 resize-y font-mono leading-6`;

export function ColorConverter() {
  const [source, setSource] = useState(""); const [output, setOutput] = useState(""); const [format, setFormat] = useState<ColorFormat>("hex"); const [error, setError] = useState<string | null>(null);
  const convert = () => { if (!source.trim()) { setError("Paste some CSS first."); return; } try { setOutput(convertCssColors(source, format)); setError(null); } catch { setError("The CSS colors could not be converted."); } };
  return <div className="space-y-6"><ToolPanel className="grid gap-4 md:grid-cols-[1fr_auto]"><label><span className={toolLabelClassName}>convert all colors to</span><select value={format} onChange={(event) => setFormat(event.target.value as ColorFormat)} className={toolInputClassName}><option value="hex">HEX</option><option value="rgb">RGB</option><option value="hsl">HSL</option><option value="oklch">OKLCH</option></select></label><ToolButton className="self-end" onClick={convert}><ArrowLeftRight size={16} />convert colors</ToolButton></ToolPanel><div className="grid gap-5 lg:grid-cols-2"><label><span className={toolLabelClassName}>input CSS</span><textarea value={source} onChange={(event) => setSource(event.target.value)} placeholder=".button { color: #d0d7e4; }" className={textarea} /></label><label><span className={toolLabelClassName}>output CSS</span><textarea readOnly value={output} placeholder="Converted CSS appears here." className={textarea} /></label></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}

export function GitDiffViewer() {
  const [before, setBefore] = useState(""); const [after, setAfter] = useState(""); const [error, setError] = useState<string | null>(null); const [hasCompared, setHasCompared] = useState(false); const [lines, setLines] = useState<ReturnType<typeof generateDiff>>([]);
  const compare = () => { if (!before.trim() || !after.trim()) { setError("Enter text in both fields."); return; } setError(null); setLines(generateDiff(before, after)); setHasCompared(true); };
  const additions = lines.filter((line) => line.type === "added").length; const removals = lines.filter((line) => line.type === "removed").length;
  return <div className="space-y-6"><div className="grid gap-5 lg:grid-cols-2"><label><span className={toolLabelClassName}>original text</span><textarea value={before} onChange={(event) => setBefore(event.target.value)} placeholder="Paste the original text." className={textarea} /></label><label><span className={toolLabelClassName}>new text</span><textarea value={after} onChange={(event) => setAfter(event.target.value)} placeholder="Paste the changed text." className={textarea} /></label></div><ToolButton onClick={compare}><GitCompareArrows size={16} />compare text</ToolButton>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<ToolPanel className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3 text-xs lowercase text-foreground/60"><span>diff result</span>{hasCompared && <span className="font-mono"><span className="text-emerald-700">+{additions}</span> <span className="text-destructive">-{removals}</span></span>}</div>{!hasCompared ? <p className="p-4 text-sm text-foreground/60">Enter text in both fields and compare it to generate a diff.</p> : lines.length === 0 ? <p className="p-4 text-sm text-foreground/60">No differences found.</p> : <div className="max-h-[32rem] overflow-auto font-mono text-sm">{lines.map((line, index) => <div key={`${line.type}-${index}`} className={`grid grid-cols-[3.5rem_3.5rem_minmax(0,1fr)] border-b border-foreground/5 ${line.type === "added" ? "bg-emerald-500/10" : line.type === "removed" ? "bg-destructive/10" : line.type === "hunk" ? "bg-card" : ""}`}><span className="px-2 py-1 text-right text-xs text-foreground/45">{line.oldLineNumber ?? ""}</span><span className="px-2 py-1 text-right text-xs text-foreground/45">{line.newLineNumber ?? ""}</span><code className="min-w-0 whitespace-pre-wrap break-all px-3 py-1">{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}{line.value || " "}</code></div>)}</div>}</ToolPanel></div>;
}
