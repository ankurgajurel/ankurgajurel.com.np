import { Metadata } from "next";
import { siteMetadata, siteConfig } from "@/config/siteConfig";
import Hero from "@/components/home/hero";
import HomeProjects from "@/components/home/projects";
import Skills from "@/components/home/skills";
import Experience from "@/components/home/experience";
import Blog from "@/components/home/blog";
import HomeUtilities from "@/components/home/utilities";
import { GithubCalendar } from "@/components/home/github";
import { getAllPostsMeta } from "@/lib/blog";
import { getProfilePageJsonLd } from "@/lib/seo";
import { Suspense } from "react";

export const metadata: Metadata = {
  ...siteMetadata,
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    ...siteMetadata.openGraph,
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    ...siteMetadata.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default async function Home() {
  const posts = getAllPostsMeta();
  const jsonLd = getProfilePageJsonLd();

  return (
    <main
      id="main-content"
      className="mx-auto w-[min(680px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <>
        <HomeProjects />
        <Experience />
        <HomeUtilities />
        <Blog posts={posts} />
        <Skills />
        <Suspense fallback={null}>
          <GithubCalendar username="ankurgajurel" />
        </Suspense>
      </>
    </main>
  );
}
