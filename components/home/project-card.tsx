import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { type Project } from "@/data/projects";
import SiteMark from "@/components/portfolio/site-mark";

export default function ProjectCard({ project }: { project: Project }) {
  const url =
    project.type === "sdk"
      ? project.links?.github
      : project.links?.demo || project.links?.github;
  return (
    <Link
      href={project.blogHref || `/projects/${project.id}`}
      className="group/card relative flex min-w-0 flex-col border border-transparent bg-card [corner-shape:squircle] transition-[box-shadow,border-color,transform,translate,scale] duration-[220ms] ease-[var(--ease),ease,var(--ease),var(--ease),var(--ease)] pointer-fine:hover:border-border pointer-fine:hover:shadow-portfolio pointer-fine:hover:-translate-y-px active:scale-[0.985] motion-reduce:translate-none! motion-reduce:scale-none! min-h-[211px] rounded-[26px] p-[22px] [&_h3]:mb-1.5 [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:leading-[1.5] [&_p]:max-w-70 [&_p]:pb-[21px] [&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-secondary-foreground [@media(max-width:640px)]:min-h-[222px] [@media(max-width:640px)]:p-[17px]"
      target={
        project.blogHref && project.blogHref.startsWith("https://")
          ? "_blank"
          : undefined
      }
    >
      <div className="mb-[18px] flex items-center justify-between">
        <span className="inline-flex size-9 items-center justify-center rounded-[12px] bg-popover shadow-[0_3px_3px_-3px_#0000000a] [corner-shape:squircle]">
          <SiteMark url={url} name={project.name} />
        </span>
        <ArrowUpRightIcon
          className="shrink-0 text-muted-foreground opacity-65 transition-[transform,translate,opacity] duration-[220ms] ease-[var(--ease),var(--ease),ease] pointer-fine:group-hover/card:translate-x-0.5 pointer-fine:group-hover/card:-translate-y-0.5 pointer-fine:group-hover/card:opacity-100 motion-reduce:translate-none!"
          size={17}
          aria-hidden="true"
        />
      </div>
      <h3>{project.name}</h3>
      <p>
        {project.summary ||
          project.description ||
          project.content ||
          project.type}
      </p>
      <div className="mt-auto flex items-center justify-between gap-1.5 text-[12px] text-muted-foreground [@media(max-width:640px)]:flex-wrap">
        <span>{project.type}</span>
        <span>{project.date.replace(",", "")}</span>
      </div>
    </Link>
  );
}
