import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import Link from "next/link";
import { getPostById, getAllPostIds } from "@/lib/blog";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { absoluteUrl, getBreadcrumbJsonLd } from "@/lib/seo";

function toIsoDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? date : parsedDate.toISOString();
}

export async function generateStaticParams() {
  return getAllPostIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const post = await getPostById(id);

  if (!post)
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };

  const url = absoluteUrl(`/blog/${post.id}`);
  const publishedTime = toIsoDate(post.date);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const post = await getPostById(id);

  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.id}`);
  const publishedTime = toIsoDate(post.date);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#blog-post`,
      headline: post.title,
      description: post.excerpt,
      url,
      mainEntityOfPage: url,
      datePublished: publishedTime,
      dateModified: publishedTime,
      author: {
        "@id": `${siteConfig.url}/#person`,
      },
      publisher: {
        "@id": `${siteConfig.url}/#person`,
      },
      image: absoluteUrl(siteConfig.ogImage),
      keywords: post.tags,
      inLanguage: "en",
    },
    getBreadcrumbJsonLd([
      { name: "Home", url: siteConfig.url },
      { name: "Blog", url: `${siteConfig.url}/blog` },
      { name: post.title, url },
    ]),
  ];

  return (
    <main
      id="main-content"
      className="mx-auto w-[min(680px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
      >
        <ArrowLeftIcon size={14} />
        all writing
      </Link>
      <article className="mt-[38px]">
        <header className="pb-9 [&_h1]:mt-0 [&_h1]:mb-5 [&_h1]:text-[clamp(26px,4vw,36px)] [&_h1]:font-[450] [&_h1]:leading-[1.3] [&_h1]:tracking-[-0.04em] [&_h1]:text-balance [@media(max-width:640px)]:pb-6">
          <p className="mt-0 mb-3.5 text-[13px] text-muted-foreground flex gap-2.5">
            <time dateTime={publishedTime}>
              {new Date(post.date)
                .toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })
                .toLowerCase()}
            </time>
          </p>
          <h1>{post.title}</h1>
          <p className="max-w-[590px] text-[15px] leading-[1.85] text-secondary-foreground">
            {post.excerpt}
          </p>
          <div className="mt-[18px] mb-3.5 flex flex-wrap gap-[5px] [&_span]:rounded-[5px] [&_span]:bg-card [&_span]:px-[7px] [&_span]:py-0.5 [&_span]:text-[12px] [&_span]:text-secondary-foreground">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>
        <div
          className="pt-2 text-[15px] leading-[1.9] text-secondary-foreground [overflow-wrap:anywhere] [&_:is(h2,h3,h4)]:mt-8 [&_:is(h2,h3,h4)]:mb-3.5 [&_:is(h2,h3,h4)]:font-medium [&_:is(h2,h3,h4)]:tracking-[-0.025em] [&_:is(h2,h3,h4)]:leading-[1.5] [&_:is(h2,h3,h4)]:text-foreground [&_h2]:text-[20px] [&_h3]:text-[16px] [&_h4]:text-[15px] [&_p]:my-[18px] [&_:is(ul,ol)]:my-[18px] [&_:is(ul,ol)]:pl-[22px] [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-2 [&_li]:pl-1 [&_strong]:font-[550] [&_strong]:text-foreground [&_a]:underline [&_a]:decoration-underline [&_a]:underline-offset-4 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:py-1 [&_blockquote]:pl-5 [&_pre]:overflow-auto [&_pre]:rounded-[18px] [&_pre]:border [&_pre]:border-border [&_pre]:bg-card! [&_pre]:p-5 [&_pre]:text-[14px] [&_pre]:leading-[1.8] [&_pre]:[corner-shape:squircle] [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-card [&_:not(pre)>code]:px-[5px] [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.9em] [&_figure]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[18px] [&_table]:block [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:text-[14px] [&_:is(th,td)]:border-b [&_:is(th,td)]:border-border [&_:is(th,td)]:p-2.5 [&_:is(th,td)]:text-left [&_hr]:my-8 [&_hr]:border-border dark:[&_pre_span]:text-foreground! [@media(max-width:640px)]:[&_pre]:p-[15px]"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <div className="mt-11 pt-[25px]">
          <Link
            href="/blog"
            className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
          >
            <ArrowLeftIcon size={14} />
            back to writing
          </Link>
        </div>
      </article>
    </main>
  );
}
