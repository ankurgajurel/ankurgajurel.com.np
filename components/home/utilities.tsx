import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { utilities } from "@/data/utilities";

export default function HomeUtilities() {
  const isExternal = (url: string) => !url.startsWith("/");

  return (
    <section id="utilities" className="container p-4 flex flex-col gap-10 my-10">
      <div>
        <Link href={"/#utilities"}>
          <h2 className="text-6xl flex gap-2 items-end group">
            <span>utilities</span>
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
          <div className="table-border-header grid grid-cols-4 p-1 text-xs">
            <div>/ NAME</div>
            <div className="col-span-2">/ DESCRIPTION</div>
            <div>/ LANGUAGE</div>
          </div>

          {utilities.map((utility) => {
            const content = <>
              <div className="text-sm">{utility.name}</div>
              <div className="col-span-2 text-sm">{utility.description}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{utility.language}</span>
                <ArrowUp size={20} className="group-hover:rotate-45 transition-transform duration-300 text-foreground" />
              </div>
            </>;
            const className = "table-border grid grid-cols-4 p-2 group hover:bg-card transition-colors duration-200 font-light cursor-pointer block";
            return <div key={utility.id}>{isExternal(utility.url) ? <a href={utility.url} target="_blank" rel="noopener noreferrer" className={className}>{content}</a> : <Link href={utility.url} className={className}>{content}</Link>}</div>;
          })}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-0 md:hidden">
        {utilities.map((utility) => {
          const content = <><div className="flex items-baseline justify-between mb-1"><span className="text-sm font-medium">{utility.name}</span><span className="text-xs text-foreground/50">{utility.language}</span></div><p className="text-sm text-foreground/70">{utility.description}</p></>;
          const className = "table-border py-3 group font-light block";
          return isExternal(utility.url) ? <a key={utility.id} href={utility.url} target="_blank" rel="noopener noreferrer" className={className}>{content}</a> : <Link key={utility.id} href={utility.url} className={className}>{content}</Link>;
        })}
      </div>
    </section>
  );
}
