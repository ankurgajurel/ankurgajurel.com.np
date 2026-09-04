"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { experiences } from "@/data/experience";
import ExperienceRow from "@/components/portfolio/experience-row";

const visibleExperiences = experiences
  .filter((experience) => !experience.hidden)
  .sort((a, b) => b.id - a.id);
const hiddenExperiences = experiences.filter((experience) => experience.hidden);

export default function Experience() {
  const [expanded, setExpanded] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion || keyboard ? 0 : 0.28;

  return (
    <section
      id="experience"
      className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
      aria-labelledby="experience-title"
    >
      <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
        <h2 id="experience-title">experience</h2>
      </div>
      <div className="grid gap-2">
        {visibleExperiences.map((experience) => (
          <ExperienceRow key={experience.id} experience={experience} />
        ))}
      </div>
      {hiddenExperiences.length > 0 && (
        <>
          <motion.div
            id="more-experience"
            inert={!expanded}
            aria-hidden={!expanded}
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden [&>div]:pt-2"
          >
            <div className="grid gap-2">
              {hiddenExperiences.map((experience) => (
                <ExperienceRow key={experience.id} experience={experience} />
              ))}
            </div>
          </motion.div>
          <button
            type="button"
            className="mt-3 mb-2 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-[13px] text-secondary-foreground transition-[background-color,color,transform,scale] duration-[180ms,180ms,160ms,160ms] ease-[ease,ease,var(--ease),var(--ease)] [&>span]:flex active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground pointer-fine:hover:bg-card pointer-fine:hover:text-foreground motion-reduce:transform-none motion-reduce:scale-none!"
            aria-expanded={expanded}
            aria-controls="more-experience"
            onClick={(event) => {
              setKeyboard(event.detail === 0);
              setExpanded((value) => !value);
            }}
          >
            {expanded ? "view less work" : "view more work"}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            >
              <CaretDownIcon size={14} />
            </motion.span>
          </button>
        </>
      )}
    </section>
  );
}
