import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { projects } from "@/data/projects";
import ProjectCard from "./project-card";

export default function HomeProjects() {
  return (
    <section
      id="projects"
      className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
      aria-labelledby="projects-title"
    >
      <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
        <h2 id="projects-title">
          selected projects<span>04</span>
        </h2>
        <Link
          href="/projects"
          className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
        >
          all projects
          <ArrowRightIcon size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 [@media(max-width:390px)]:grid-cols-1">
        {projects.slice(0, 4).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
