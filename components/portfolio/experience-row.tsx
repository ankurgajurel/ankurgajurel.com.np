"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { experiences } from "@/data/experience";
import SiteMark from "./site-mark";
export default function ExperienceRow({
  experience,
}: {
  experience: (typeof experiences)[number];
}) {
  const [open, setOpen] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const reduceMotion = useReducedMotion();
  const id = `experience-${experience.id}`;
  const instant = reduceMotion || keyboard;
  const multipleRoles = experience.roles.length > 1;
  return (
    <div
      className="min-w-0 rounded-[26px] border border-transparent bg-transparent px-[22px] [corner-shape:squircle] transition-[background-color] duration-180 ease-[ease] data-[open=true]:bg-card [@media(max-width:640px)]:px-[17px]"
      data-open={open}
    >
      <button
        className="group/experience flex w-full items-center gap-[13px] py-3 text-left [@media(max-width:640px)]:gap-2.5"
        aria-expanded={open}
        aria-controls={id}
        onClick={(event) => {
          setKeyboard(event.detail === 0);
          setOpen((value) => !value);
        }}
      >
        <span className="mt-[3px] flex size-[34px] shrink-0 items-center justify-center self-start rounded-[11px] border border-border bg-popover [corner-shape:squircle]">
          <SiteMark url={experience.website} name={experience.company} />
        </span>
        <span className="flex min-w-0 flex-col leading-[1.45] [&_strong]:text-[15px] [&_strong]:font-medium [&>span]:text-[13px] [&>span]:text-muted-foreground pointer-fine:group-hover/experience:[&_strong]:underline pointer-fine:group-hover/experience:[&_strong]:decoration-underline pointer-fine:group-hover/experience:[&_strong]:underline-offset-4">
          <strong>{experience.company}</strong>
          <span>{experience.roles[0].title}</span>
          {experience.roles[0].type && (
            <span className="mt-px text-[12px]!">
              {experience.roles[0].type}
            </span>
          )}
        </span>
        <span className="ml-auto text-[12px] whitespace-nowrap text-muted-foreground [@media(max-width:390px)]:max-w-[93px] [@media(max-width:390px)]:text-right [@media(max-width:390px)]:whitespace-normal">
          {experience.roles[0].period?.replace(
            /\b(\w{3})\w+ (\d{4})/g,
            "$1 $2",
          )}
        </span>
        <PlusIcon
          size={15}
          className="ml-3 shrink-0 text-muted-foreground transition-transform duration-260 ease-portfolio data-[open=true]:rotate-45 data-instant:duration-0 [@media(max-width:640px)]:ml-0"
          data-open={open}
          data-instant={instant || undefined}
          aria-hidden="true"
        />
      </button>
      {experience.excerpt && (
        <p className="pb-3.5 pl-[47px] text-[14px] leading-[1.8] text-secondary-foreground [@media(max-width:640px)]:pl-0">
          {experience.excerpt.toLowerCase()}
        </p>
      )}
      <div id={id}>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              role="region"
              aria-label={`${experience.company} details`}
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: instant ? 0 : 0.26,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="pt-0.5 pb-6 pl-[47px] [@media(max-width:640px)]:pt-1 [@media(max-width:640px)]:pb-5 [@media(max-width:640px)]:pl-0">
                {experience.roles.map((role) => (
                  <div
                    className="not-first:mt-6 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 [&>div]:text-[13px] [&_strong]:font-medium [&>div>span]:text-muted-foreground [&_p]:mt-[9px] [&_p]:text-[14px] [&_p]:leading-[1.8] [&_p]:text-secondary-foreground [&>p:first-child]:mt-0 [@media(max-width:640px)]:[&>div]:flex-wrap [@media(max-width:640px)]:[&>div]:gap-[3px]"
                    key={role.title}
                  >
                    {multipleRoles && (
                      <>
                        <div>
                          <strong>{role.title}</strong>
                        </div>
                        {role.period && (
                          <p className="mt-[3px]! text-[12px]! text-muted-foreground!">
                            {role.period}
                          </p>
                        )}
                      </>
                    )}
                    {role.description && (
                      <p>{role.description.toLowerCase()}</p>
                    )}
                    {role.highlights && (
                      <ul className="mt-3.5 grid list-disc gap-2.5 pl-[18px] text-[14px] leading-[1.8] text-secondary-foreground [&_li]:marker:text-muted-foreground">
                        {role.highlights.map((highlight) => (
                          <li key={highlight}>{highlight.toLowerCase()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {experience.stacks.length > 0 && (
                  <div className="mt-[18px] mb-3.5 flex flex-wrap gap-[5px] [&_span]:rounded-[5px] [&_span]:bg-popover [&_span]:px-[7px] [&_span]:py-0.5 [&_span]:text-[12px] [&_span]:text-secondary-foreground">
                    {experience.stacks.map((stack) => (
                      <span key={stack}>{stack}</span>
                    ))}
                  </div>
                )}
                {experience.website && (
                  <a
                    className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
                    href={experience.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    visit {experience.company}
                    <ArrowUpRightIcon size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
