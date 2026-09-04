import HeroAvatar from "@/components/portfolio/hero-avatar";
import HeroBio from "@/components/portfolio/hero-bio";
import { user } from "@/data/general";

export default function Hero() {
  return (
    <section className="p-0" aria-labelledby="intro-title">
      <div className="flex items-start gap-[18px]">
        <HeroAvatar src={user.avatar} name={user.name} />
        <div>
          <h1
            id="intro-title"
            className="text-[22px] font-medium leading-[1.4]"
          >
            {user.name}
          </h1>
          <p className="text-[16px] leading-[1.6] text-muted-foreground">
            {user.hero.subtitle}
          </p>
          <p className="text-[15px] leading-[1.6] text-muted-foreground">
            {user.location}
          </p>
        </div>
      </div>
      <HeroBio paragraphs={user.hero.bio}>
        <p>
          thanks for stopping by! i&apos;m open to{" "}
          <span className="font-semibold">
            freelance work, full-time opportunities, collaborations, and
            interesting projects
          </span>
          . feel free to{" "}
          <a
            href="#projects"
            className="text-foreground underline decoration-underline decoration-1 underline-offset-[3px] [overflow-wrap:anywhere] transition-[text-decoration-color] duration-180 ease-[ease] pointer-fine:hover:decoration-foreground/45"
          >
            check out my work
          </a>{" "}
          or reach me at{" "}
          <a
            href={user.socials.mail}
            className="text-foreground underline decoration-underline decoration-1 underline-offset-[3px] [overflow-wrap:anywhere] transition-[text-decoration-color] duration-180 ease-[ease] pointer-fine:hover:decoration-foreground/45"
          >
            {user.socials.mail.replace(/^mailto:/, "")}
          </a>
          .
        </p>
      </HeroBio>

      {user.openForWork && (
        <div className="mt-6 flex flex-wrap items-center gap-4 text-[14px]">
          <a
            className="ml-0 inline-flex items-center gap-[7px] text-[13px] text-muted-foreground transition-[color] duration-180 ease-[ease] [&_i]:size-[5px] [&_i]:rounded-full [&_i]:bg-[#69937a] pointer-fine:hover:text-secondary-foreground"
            href={user.socials.twitter}
            target="_blank"
            rel="noreferrer"
          >
            <i aria-hidden="true" />
            open for work
          </a>
        </div>
      )}
    </section>
  );
}
