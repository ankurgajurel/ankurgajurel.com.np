"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";
import HomeProjectCard from "./project-card";
import { useRouter } from "next/navigation";

export default function HomeProjects() {
  const router = useRouter();

  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <div>
        <Link href={"/#projects"}>
          <h2 className="text-6xl flex gap-2 items-end group">
            <span>projects</span>
            <ArrowUp
              size={48}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </h2>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-0">
          <div className="table-border-header grid grid-cols-5 p-1 text-xs text-foreground/50">
            <div>/ DATE</div>
            <div className="col-span-2">/ PROJECT</div>
            <div>/ COLLABS</div>
            <div className="grid grid-cols-2">
              <div>/ TYPE</div>
              <div></div>
            </div>
          </div>

          {projects.map((project) => (
            <div key={project.id}>
              <HomeProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-0 md:hidden">
        {projects.map((project) => (
          <div
            key={project.id}
            className={
              project.featured
                ? "border-l-2 border-l-foreground bg-foreground/[0.03] py-3 pl-3 pr-1 cursor-pointer"
                : "table-border py-3 cursor-pointer"
            }
            onClick={() => router.push("/projects/" + project.id)}
          >
            <div className="flex items-baseline justify-between mb-1">
              <span className={`text-sm flex items-center gap-2 ${project.featured ? "font-medium" : "font-medium"}`}>
                {project.name}
                {project.featured && (
                  <span className="text-[0.6rem] tracking-widest uppercase text-foreground/40 border border-foreground/15 px-1.5 py-px">
                    new
                  </span>
                )}
              </span>
              <span className="text-xs text-foreground/50">{project.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/50">{project.type}</span>
              {project.collabs.length > 0 && (
                <div className="flex gap-1">
                  {project.collabs.map((collab) => (
                    <a
                      key={collab}
                      href={`https://github.com/${collab}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors"
                    >
                      @{collab}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
