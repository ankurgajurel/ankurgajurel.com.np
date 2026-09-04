import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { GithubCalendarGrid } from "./github-calendar-grid";

interface ContributionDay {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

export interface GithubContributionData {
  contributions: ContributionDay[][];
  totalContributions: number;
}

async function getContributions(
  username: string,
): Promise<GithubContributionData | null> {
  try {
    const response = await fetch(
      `https://github-contributions-api.deno.dev/${username}.json`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function GithubCalendar({
  username,
  className,
}: {
  username: string;
  className?: string;
}) {
  const data = await getContributions(username);

  if (!data) return null;

  return (
    <section
      className={cn(
        "mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11",
        className,
      )}
      aria-labelledby="github-title"
    >
      <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
        <h2 id="github-title">a little, every day</h2>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
        >
          github
          <ArrowUpRightIcon size={14} />
        </a>
      </div>
      <div className="rounded-[22px] bg-card p-[18px] [corner-shape:squircle] [@media(max-width:640px)]:p-[13px]">
        <GithubCalendarGrid weeks={data.contributions} />
        <div className="mt-3.5 flex justify-between gap-2.5 text-[12px] text-muted-foreground [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-[3px] [&_i]:size-2 [&_i]:rounded-[2px] [&_i]:bg-border [@media(max-width:640px)]:flex-wrap [@media(max-width:640px)]:text-[11px] [&_i:nth-of-type(2)]:bg-[#c5d7ca] dark:[&_i:nth-of-type(2)]:bg-[#293f30] [&_i:nth-of-type(3)]:bg-[#9fbea9] dark:[&_i:nth-of-type(3)]:bg-[#3d6149] [&_i:nth-of-type(4)]:bg-[#739c83] dark:[&_i:nth-of-type(4)]:bg-[#628770] [&_i:nth-of-type(5)]:bg-[#4c775e] dark:[&_i:nth-of-type(5)]:bg-[#92b19b]">
          <span>
            {data.totalContributions.toLocaleString()} contributions in the last
            year
          </span>
          <span>
            less <i />
            <i />
            <i />
            <i />
            <i /> more
          </span>
        </div>
      </div>
    </section>
  );
}
