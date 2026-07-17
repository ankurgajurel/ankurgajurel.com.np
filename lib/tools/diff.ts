import { structuredPatch } from "diff";

export type DiffLine = { type: "context" | "added" | "removed" | "hunk" | "info"; value: string; oldLineNumber: number | null; newLineNumber: number | null };

export function generateDiff(before: string, after: string): DiffLine[] {
  const patch = structuredPatch("Original", "Modified", before.endsWith("\n") ? before : `${before}\n`, after.endsWith("\n") ? after : `${after}\n`);
  return patch.hunks.flatMap((hunk) => {
    const lines: DiffLine[] = [{ type: "hunk", value: `@@ -${hunk.oldStart},${hunk.oldLines ?? 0} +${hunk.newStart},${hunk.newLines ?? 0} @@`, oldLineNumber: null, newLineNumber: null }];
    let oldLine = hunk.oldStart; let newLine = hunk.newStart;
    for (const line of hunk.lines) {
      const marker = line[0]; const value = line.slice(1);
      if (marker === "-") lines.push({ type: "removed", value, oldLineNumber: oldLine++, newLineNumber: null });
      else if (marker === "+") lines.push({ type: "added", value, oldLineNumber: null, newLineNumber: newLine++ });
      else if (marker === " ") lines.push({ type: "context", value, oldLineNumber: oldLine++, newLineNumber: newLine++ });
      else lines.push({ type: "info", value: line, oldLineNumber: null, newLineNumber: null });
    }
    return lines;
  });
}
