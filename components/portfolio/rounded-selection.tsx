"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function RoundedSelection() {
  const overlay = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const layer = overlay.current;
    if (!layer) return;
    let frame = 0;
    const draw = () => {
      layer.replaceChildren();
      document.body.removeAttribute("data-selection-painted");
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const ancestor = range.commonAncestorContainer;
      const element =
        ancestor instanceof Element ? ancestor : ancestor.parentElement;
      if (element?.closest("input, textarea, [contenteditable]")) return;
      const rects: DOMRect[] = [];
      const addTextRects = (node: Node) => {
        if (!node.textContent?.trim() || !range.intersectsNode(node)) return;
        if (
          node.parentElement?.closest(
            "script, style, [aria-hidden=true], input, textarea, [contenteditable]",
          )
        )
          return;
        const textRange = document.createRange();
        textRange.selectNodeContents(node);
        if (node === range.startContainer)
          textRange.setStart(node, range.startOffset);
        if (node === range.endContainer)
          textRange.setEnd(node, range.endOffset);
        rects.push(...textRange.getClientRects());
      };
      if (ancestor.nodeType === Node.TEXT_NODE) addTextRects(ancestor);
      else {
        const walker = document.createTreeWalker(
          ancestor,
          NodeFilter.SHOW_TEXT,
        );
        let node: Node | null;
        while ((node = walker.nextNode())) addTextRects(node);
      }
      const lines: {
        left: number;
        top: number;
        right: number;
        bottom: number;
      }[] = [];
      for (const rect of rects) {
        if (!rect.width || rect.bottom < 0 || rect.top > innerHeight) continue;
        const line = lines.find(
          (l) =>
            Math.abs(l.top - rect.top) < 3 &&
            rect.left <= l.right + 3 &&
            rect.right >= l.left - 3,
        );
        if (line) {
          line.left = Math.min(line.left, rect.left);
          line.right = Math.max(line.right, rect.right);
          line.bottom = Math.max(line.bottom, rect.bottom);
        } else
          lines.push({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
      }
      for (const line of lines) {
        const mark = document.createElement("span");
        Object.assign(mark.style, {
          left: `${line.left - 1}px`,
          top: `${line.top - 1}px`,
          width: `${line.right - line.left + 2}px`,
          height: `${line.bottom - line.top + 2}px`,
        });
        layer.appendChild(mark);
      }
      if (lines.length)
        document.body.setAttribute("data-selection-painted", "true");
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    document.addEventListener("selectionchange", schedule);
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      layer.replaceChildren();
      document.body.removeAttribute("data-selection-painted");
    };
  }, [pathname]);
  return (
    <div
      ref={overlay}
      className="pointer-events-none fixed inset-0 z-100 overflow-hidden [&_span]:absolute [&_span]:rounded-[5px] [&_span]:bg-selection"
      aria-hidden="true"
    />
  );
}
