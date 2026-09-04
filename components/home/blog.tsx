import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import type { BlogPostMeta } from "@/lib/blog";

export function WritingList({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <div className="grid">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-[18px] py-5 [&_h3]:m-0 [&_h3]:text-[15px] [&_h3]:font-[450] [&_p]:mt-1.5 [&_p]:max-w-110 [&_p]:text-[13px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_time]:text-[12px] [&_time]:whitespace-nowrap [&_time]:text-muted-foreground [&>svg]:text-muted-foreground [&>svg]:transition-transform [&>svg]:duration-[220ms] [&>svg]:ease-portfolio pointer-fine:hover:[&_h3]:underline pointer-fine:hover:[&_h3]:decoration-underline pointer-fine:hover:[&_h3]:underline-offset-4 pointer-fine:hover:[&>svg]:translate-x-[3px] [@media(max-width:640px)]:grid-cols-[minmax(0,1fr)_auto] [@media(max-width:640px)]:gap-2 [@media(max-width:640px)]:[&>svg]:hidden"
        >
          <div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </div>
          <time dateTime={new Date(post.date).toISOString()}>
            {new Date(post.date)
              .toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              })
              .toLowerCase()}
          </time>
          <ArrowRightIcon size={14} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export default function HomeBlog({ posts }: { posts: BlogPostMeta[] }) {
  if (!posts.length) return null;
  return (
    <section
      id="blogs"
      className="mt-15 scroll-mt-25 [@media(max-width:640px)]:mt-11"
      aria-labelledby="writing-title"
    >
      <div className="mb-[18px] flex items-baseline justify-between gap-4 [&_h2]:text-[15px] [&_h2]:font-[450] [&_h2]:text-secondary-foreground [&_h2_span]:ml-2 [&_h2_span]:text-[12px] [&_h2_span]:text-muted-foreground [&_h2_span]:tabular-nums">
        <h2 id="writing-title">writing</h2>
        <Link
          href="/blog"
          className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
        >
          all notes
          <ArrowRightIcon size={14} />
        </Link>
      </div>
      <WritingList posts={posts.slice(0, 3)} />
    </section>
  );
}
