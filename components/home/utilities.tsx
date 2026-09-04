import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { utilities } from "@/data/utilities";
import UtilityCard from "@/components/portfolio/utility-card";

export default function HomeUtilities() {
  return (
    <section
      id="utilities"
      className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
      aria-labelledby="utilities-title"
    >
      <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
        <h2 id="utilities-title">
          little utilities
          <span>{String(utilities.length).padStart(2, "0")}</span>
        </h2>
        <Link
          href="/tools"
          className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
        >
          all tools
          <ArrowRightIcon size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2.5 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:390px)]:gap-2">
        {utilities.map((utility) => (
          <UtilityCard key={utility.id} utility={utility} />
        ))}
      </div>
    </section>
  );
}
