import Image from "next/image";
import { skillIcons, skills } from "@/data/skills";

export default function HomeSkills() {
  return (
    <section
      id="skills"
      className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
      aria-labelledby="skills-title"
    >
      <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
        <h2 id="skills-title">what i work with</h2>
      </div>
      <ul className="grid grid-cols-10 gap-3 [@media(max-width:640px)]:grid-cols-5 [@media(max-width:640px)]:gap-2.5 [@media(max-width:640px)]:[&>li:nth-child(5n+1)_[data-tooltip]]:left-0 [@media(max-width:640px)]:[&>li:nth-child(5n+1)_[data-tooltip]]:translate-x-0 [@media(max-width:640px)]:[&>li:nth-child(5n)_[data-tooltip]]:left-auto [@media(max-width:640px)]:[&>li:nth-child(5n)_[data-tooltip]]:right-0 [@media(max-width:640px)]:[&>li:nth-child(5n)_[data-tooltip]]:translate-x-0">
        {skills
          .flatMap((skill) => skill.items)
          .map((name) => {
            const technology = skillIcons[name];
            return (
              <li key={name}>
                <a
                  className="group/skill relative flex h-13 w-full items-center justify-center rounded-[17px] bg-card [corner-shape:squircle] transition-[background-color] duration-160 ease-[ease] [&_img]:object-contain pointer-fine:hover:bg-border"
                  href={technology.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                >
                  <Image
                    src={`/icons/technologies/${technology.icon}.svg`}
                    width={28}
                    height={28}
                    alt=""
                    className={
                      "invert" in technology
                        ? "dark:invert"
                        : "monochrome" in technology
                          ? "dark:brightness-0 dark:invert"
                          : undefined
                    }
                  />
                  <span
                    className="invisible pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-2 -translate-x-1/2 rounded-[8px] bg-foreground px-[9px] py-[5px] text-[12px] leading-[1.4] whitespace-nowrap text-background group-focus-visible/skill:visible pointer-fine:group-hover/skill:visible"
                    data-tooltip
                    aria-hidden="true"
                  >
                    {name.toLowerCase()}
                  </span>
                </a>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
