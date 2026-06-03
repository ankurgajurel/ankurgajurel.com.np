import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { BlogPostMeta } from "@/lib/blog";

export default function HomeBlog({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <section id="blogs" className="container p-4 flex flex-col gap-10">
      <div>
        <Link href="/#blogs">
          <h2 className="text-6xl flex gap-2 items-end group">
            <span>writes</span>
            <ArrowUp
              size={48}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </h2>
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <div key={post.id}>
            <a
              href={`/blog/${post.id}`}
              className="group border-b-[0.5px] border-foreground/20 pb-8 last:border-0"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row items-baseline gap-1 md:gap-4">
                  <h3 className="text-2xl font-medium animated-underline">
                    {post.title}
                  </h3>
                  <span className="text-sm text-foreground/60">{post.date}</span>
                </div>
                <p className="text-lg font-light">{post.excerpt}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
