"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const previewEnding = "outside of work";

export default function HeroBio({
  paragraphs,
  children,
}: {
  paragraphs: string[];
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const reduceMotion = useReducedMotion();
  const details = useRef<HTMLDivElement>(null);
  const detailsId = useId();
  const cutoff = paragraphs.findIndex((paragraph) =>
    paragraph.startsWith(previewEnding),
  );
  const collapsible = cutoff !== -1;
  const duration = reduceMotion || keyboard ? 0 : 0.28;

  useEffect(() => {
    if (expanded && keyboard) details.current?.focus({ preventScroll: true });
  }, [expanded, keyboard]);

  return (
    <div className="grid gap-2.5 pt-8 text-[14px] leading-[1.75] text-secondary-foreground [@media(max-width:640px)]:text-[15px]">
      {(collapsible ? paragraphs.slice(0, cutoff) : paragraphs).map(
        (paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ),
      )}
      {collapsible ? (
        <div className="relative min-h-[1lh]">
          <motion.div
            initial={false}
            animate={{ opacity: expanded ? 0 : 1 }}
            transition={{ duration: duration ? 0.12 : 0 }}
            inert={expanded}
            aria-hidden={expanded}
            className="absolute top-0 left-0"
          >
            {previewEnding}
            <span
              aria-hidden="true"
              className="[mask-image:linear-gradient(to_right,#000,transparent)]"
            >
              {paragraphs[cutoff].slice(
                previewEnding.length,
                previewEnding.length + 7,
              )}
            </span>{" "}
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={(event) => {
                setKeyboard(event.detail === 0);
                setExpanded(true);
              }}
              className="rounded-[3px] text-foreground underline decoration-underline underline-offset-[3px] transition-[text-decoration-color] duration-180 ease-[ease] pointer-fine:hover:decoration-foreground/45"
            >
              read more
            </button>
          </motion.div>
          <motion.div
            ref={details}
            id={detailsId}
            role="region"
            aria-label="Full bio"
            tabIndex={-1}
            inert={!expanded}
            aria-hidden={!expanded}
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{
              height: { duration, ease: [0.22, 1, 0.36, 1] },
              opacity: {
                duration: duration ? 0.22 : 0,
                delay: duration ? 0.04 : 0,
                ease: "easeOut",
              },
            }}
            className="overflow-hidden outline-none"
          >
            <div className="grid gap-2.5">
              {paragraphs.slice(cutoff).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {children}
            </div>
          </motion.div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
