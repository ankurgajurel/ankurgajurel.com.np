import { toolCategories } from "@/data/tools";
import { utilities } from "@/data/utilities";
import UtilityCard from "@/components/portfolio/utility-card";

export function ToolsDirectory() {
  return (
    <main
      id="main-content"
      className="mx-auto w-[min(680px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <header className="mb-[38px] [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-[30px] [&_h1]:font-[450] [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.045em] [&_h1>span]:ml-3 [&_h1>span]:align-middle [&_h1>span]:text-[14px] [&_h1>span]:font-normal [&_h1>span]:tracking-normal [&_h1>span]:text-muted-foreground [&>p:last-child]:max-w-[490px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-secondary-foreground">
        <p className="mt-0 mb-3.5 text-[13px] text-muted-foreground">
          small things, made useful
        </p>
        <h1>tools</h1>
        <p>
          browser-first utilities for the little tasks that come up every day.
          open one and get straight to it.
        </p>
      </header>
      {toolCategories.map((category) => (
        <section
          key={category.name}
          className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
          aria-labelledby={`${category.name.replaceAll(" ", "-")}-tools`}
        >
          <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
            <h2 id={`${category.name.replaceAll(" ", "-")}-tools`}>
              {category.name === "easter"
                ? "interface experiments"
                : category.name}
            </h2>
            <span className="text-[13px] text-muted-foreground [@media(max-width:640px)]:hidden">
              {String(category.tools.length).padStart(2, "0")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:390px)]:gap-2">
            {category.tools.map((tool, index) => (
              <UtilityCard
                key={tool.link}
                utility={{
                  id: index,
                  name: tool.name,
                  description: tool.description.toLowerCase(),
                  url: tool.link,
                  language: "web",
                }}
              />
            ))}
          </div>
        </section>
      ))}
      <section
        className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
        aria-labelledby="open-source-title"
      >
        <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
          <h2 id="open-source-title">open source</h2>
          <span className="text-[13px] text-muted-foreground [@media(max-width:640px)]:hidden">
            little helpers for developers
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:390px)]:gap-2">
          {utilities
            .filter((utility) => utility.url.startsWith("https://github.com/"))
            .map((utility) => (
              <UtilityCard key={utility.id} utility={utility} />
            ))}
        </div>
      </section>
    </main>
  );
}
