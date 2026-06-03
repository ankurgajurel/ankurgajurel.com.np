import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { user } from "@/data/general";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="p-4 container my-10 md:my-16 lg:my-20">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 md:gap-5">
          <a href={user.socials.twitter} target="_blank">
            <Image
              src={user.avatar}
              alt={user.name}
              width={96}
              height={96}
              className="size-20 md:size-24 shrink-0 rounded-[4px] border border-foreground/10 object-cover hover:shadow-md transition-shadow duration-300 cursor-pointer"
            />
          </a>
          <div className="flex min-w-0 flex-col items-start gap-1">
            <h2 className="text-4xl md:text-6xl font-instrument-serif leading-none">
              {user.name}
            </h2>
            <p className="text-lg md:text-2xl font-bodoni font-extralight leading-none tracking-tighter">
              {user.hero.subtitle}
            </p>
          </div>
        </div>

        <div className="pr-5 md:pr-0 md:max-w-3/5">
          <p className="text-lg md:text-xl font-light leading-relaxed">
            {user.hero.userExcerpt}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/#projects"
            className="group flex items-center gap-2 text-lg"
          >
            <span className="animated-underline">view projects</span>
            <ArrowUp
              size={20}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </Link>
          <Link
            href="/#blogs"
            className="group flex items-center gap-2 text-lg"
          >
            <span className="animated-underline">writes</span>
            <ArrowUp
              size={20}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </Link>
          <Link href={user.socials.calcom} target="_blank" className="group flex items-center gap-2 text-lg">
            <span className="animated-underline">(open for work)</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
