import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import type { Utility } from "@/data/utilities";
import SiteMark from "./site-mark";

export default function UtilityCard({ utility }: { utility: Utility }) {
  const parsed = new URL(utility.url, "https://ankurgajurel.com.np");
  const github = parsed.hostname === "github.com";
  const external = !utility.url.startsWith("/");
  return (
    <Link
      href={utility.url}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group/card relative flex min-w-0 flex-col border border-transparent bg-card [corner-shape:squircle] transition-[box-shadow,border-color,transform,translate,scale] duration-[220ms] ease-[var(--ease),ease,var(--ease),var(--ease),var(--ease)] pointer-fine:hover:border-border pointer-fine:hover:shadow-portfolio pointer-fine:hover:-translate-y-px active:scale-[0.985] motion-reduce:translate-none! motion-reduce:scale-none! min-h-[210px] rounded-[23px] p-[18px] [&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:[overflow-wrap:anywhere] [&_p]:mt-[7px] [&_p]:pb-[18px] [&_p]:text-[13px] [&_p]:leading-[1.7] [&_p]:text-secondary-foreground [@media(max-width:390px)]:p-3.5"
    >
      <div className="mb-[19px] flex items-center gap-[7px] [&>span]:rounded-[20px] [&>span]:border [&>span]:border-border [&>span]:px-1.5 [&>span]:text-[12px] [&>span]:leading-[1.8] [&>span]:text-muted-foreground [&>svg:last-child]:ml-auto">
        <SiteMark url={utility.url} name={utility.name} />
        <span>{github ? "public" : "website"}</span>
        <ArrowUpRightIcon
          size={14}
          className="shrink-0 text-muted-foreground opacity-65 transition-[transform,translate,opacity] duration-[220ms] ease-[var(--ease),var(--ease),ease] pointer-fine:group-hover/card:translate-x-0.5 pointer-fine:group-hover/card:-translate-y-0.5 pointer-fine:group-hover/card:opacity-100 motion-reduce:translate-none!"
          aria-hidden="true"
        />
      </div>
      {github && (
        <span className="text-[12px] text-muted-foreground">
          {parsed.pathname.split("/")[1]} /
        </span>
      )}
      <h3>{utility.name}</h3>
      <p>{utility.description}</p>
      <span className="mt-auto flex items-center gap-[5px] text-[12px] text-muted-foreground [&_i]:size-[7px] [&_i]:rounded-full [&_i]:bg-[#497fa5]">
        {github && <i />}
        {github ? utility.language.toLowerCase() : "in your browser"}
      </span>
    </Link>
  );
}
