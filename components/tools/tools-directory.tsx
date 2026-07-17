import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { toolCategories } from "@/data/tools";

export function ToolsDirectory() {
  return (
    <main className="container px-4 py-10 sm:py-14">
      <header className="mb-12 max-w-2xl">
        <p className="mb-4 text-sm text-foreground/60">/ collection</p>
        <h1 className="text-5xl font-medium tracking-tight sm:text-7xl">tools</h1>
        <p className="mt-4 text-base text-foreground/65 sm:text-lg">
          Small, browser-first utilities for the work that should take a few
          seconds, not another tab full of ads.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {toolCategories.map((category) => (
          <section key={category.name} aria-labelledby={`${category.name}-tools`}>
            <h2
              id={`${category.name}-tools`}
              className="table-border-header pb-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground/60"
            >
              / {category.name}
            </h2>
            <div>
              {category.tools.map((tool) => (
                <Link
                  key={`${category.name}-${tool.name}`}
                  href={tool.link}
                  className="table-border group grid gap-2 py-4 transition-colors hover:bg-card sm:grid-cols-[minmax(12rem,0.8fr)_2fr_auto] sm:items-center sm:px-2"
                >
                  <span className="text-base">{tool.name}</span>
                  <span className="text-sm text-foreground/60">{tool.description}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={19}
                    className="justify-self-end transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
