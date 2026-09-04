import type { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/blog";
import { WritingList } from "@/components/home/blog";

export const metadata: Metadata = {
  title: "writing",
  description:
    "notes on building software, experiments, and things learned along the way.",
  alternates: { canonical: "/blog" },
};
export default function WritingPage() {
  const posts = getAllPostsMeta();
  return (
    <main
      id="main-content"
      className="mx-auto w-[min(680px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <header className="mb-[38px] [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-[30px] [&_h1]:font-[450] [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.045em] [&_h1>span]:ml-3 [&_h1>span]:align-middle [&_h1>span]:text-[14px] [&_h1>span]:font-normal [&_h1>span]:tracking-normal [&_h1>span]:text-muted-foreground [&>p:last-child]:max-w-[490px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-secondary-foreground">
        <p className="mt-0 mb-3.5 text-[13px] text-muted-foreground">
          notes from the process
        </p>
        <h1>
          writing<span>{String(posts.length).padStart(2, "0")}</span>
        </h1>
        <p>
          things i’ve figured out, things i’m still figuring out, and the
          occasional deep dive.
        </p>
      </header>
      <WritingList posts={posts} />
    </main>
  );
}
