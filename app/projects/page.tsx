import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/home/project-card";

export const metadata: Metadata = {
  title: "projects",
  description:
    "software, experiments, and open-source projects by ankur gajurel.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main
      id="main-content"
      className="mx-auto w-[min(680px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <header className="mb-[38px] [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-[30px] [&_h1]:font-[450] [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.045em] [&_h1>span]:ml-3 [&_h1>span]:align-middle [&_h1>span]:text-[14px] [&_h1>span]:font-normal [&_h1>span]:tracking-normal [&_h1>span]:text-muted-foreground [&>p:last-child]:max-w-[490px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-secondary-foreground">
        <p className="mt-0 mb-3.5 text-[13px] text-muted-foreground">
          a collection of things i’ve made
        </p>
        <h1>
          projects<span>{String(projects.length).padStart(2, "0")}</span>
        </h1>
        <p>
          from small experiments to software people use. a few things i’ve
          built, shipped, and learned from.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-3 [@media(max-width:390px)]:grid-cols-1">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
