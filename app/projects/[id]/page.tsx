import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import SiteMark from "@/components/portfolio/site-mark";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import {
  absoluteUrl,
  getBreadcrumbJsonLd,
  projectDescription,
  projectKeywords,
} from "@/lib/seo";

export async function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number((await params).id);

  const project = projects.find((project) => project.id === id);

  if (!project)
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };

  const description = projectDescription(project);
  const url = absoluteUrl(`/projects/${project.id}`);

  return {
    title: project.name,
    description,
    keywords: projectKeywords(project),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: project.name,
      description,
      url,
      type: "article",
      tags: project.technologies,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);

  const project = projects.find((project) => project.id === id);

  if (!project) notFound();

  const description = projectDescription(project);
  const url = absoluteUrl(`/projects/${project.id}`);
  const links = [
    project.links?.demo,
    project.links?.github,
    project.links?.docs,
  ].filter((link): link is string => Boolean(link));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#project`,
      name: project.name,
      description,
      url,
      dateCreated: project.date,
      genre: project.type,
      creator: {
        "@id": `${siteConfig.url}/#person`,
      },
      keywords: projectKeywords(project),
      about: projectKeywords(project),
      sameAs: links,
    },
    getBreadcrumbJsonLd([
      { name: "Home", url: siteConfig.url },
      { name: "Projects", url: `${siteConfig.url}/projects` },
      { name: project.name, url },
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
        href="/projects"
        className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
      >
        <ArrowLeftIcon size={14} />
        all projects
      </Link>
      <article className="mt-[38px]">
        <header className="pb-9 [&_h1]:mt-0 [&_h1]:mb-5 [&_h1]:text-[clamp(26px,4vw,36px)] [&_h1]:font-[450] [&_h1]:leading-[1.3] [&_h1]:tracking-[-0.04em] [&_h1]:text-balance [@media(max-width:640px)]:pb-6">
          <span className="mb-6 flex size-13 items-center justify-center rounded-[17px] bg-card [corner-shape:squircle]">
            <SiteMark
              url={
                project.type === "sdk"
                  ? project.links?.github
                  : project.links?.demo || project.links?.github
              }
              name={project.name}
              size={28}
            />
          </span>
          <p className="mt-0 mb-3.5 text-[13px] text-muted-foreground flex gap-2.5">
            {project.type} <span aria-hidden="true">/</span> {project.date}
          </p>
          <h1>{project.name}</h1>
          <p className="max-w-[590px] text-[15px] leading-[1.85] text-secondary-foreground">
            {project.description || project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[38px] items-center gap-2.5 rounded-[13px] bg-card px-[13px] py-2 text-[13px] text-foreground [corner-shape:squircle] transition-[box-shadow,transform,scale] duration-180 ease-[ease,var(--ease),var(--ease)] pointer-fine:hover:shadow-portfolio active:scale-[0.98]"
              >
                visit website
                <ArrowUpRightIcon size={15} />
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[38px] items-center gap-2.5 rounded-[13px] bg-card px-[13px] py-2 text-[13px] text-foreground [corner-shape:squircle] transition-[box-shadow,transform,scale] duration-180 ease-[ease,var(--ease),var(--ease)] pointer-fine:hover:shadow-portfolio active:scale-[0.98]"
              >
                source code
                <ArrowUpRightIcon size={15} />
              </a>
            )}
            {project.links?.docs && (
              <a
                href={project.links.docs}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[38px] items-center gap-2.5 rounded-[13px] bg-card px-[13px] py-2 text-[13px] text-foreground [corner-shape:squircle] transition-[box-shadow,transform,scale] duration-180 ease-[ease,var(--ease),var(--ease)] pointer-fine:hover:shadow-portfolio active:scale-[0.98]"
              >
                documentation
                <ArrowUpRightIcon size={15} />
              </a>
            )}
          </div>
        </header>
        <section
          className="mt-9 [&_h2]:mt-0 [&_h2]:mb-4 [&_h2]:text-[14px] [&_h2]:font-[450] [&_h2]:text-muted-foreground [&>p]:text-[15px] [&>p]:leading-[1.9] [&>p]:text-secondary-foreground"
          aria-labelledby="overview-title"
        >
          <h2 id="overview-title">the project</h2>
          <p>{project.content || project.description}</p>
        </section>
        {!!project.technologies?.length && (
          <section
            className="mt-9 [&_h2]:mt-0 [&_h2]:mb-4 [&_h2]:text-[14px] [&_h2]:font-[450] [&_h2]:text-muted-foreground [&>p]:text-[15px] [&>p]:leading-[1.9] [&>p]:text-secondary-foreground"
            aria-labelledby="built-with-title"
          >
            <h2 id="built-with-title">built with</h2>
            <div className="m-0 flex flex-wrap gap-[5px] [&_span]:rounded-[5px] [&_span]:bg-card [&_span]:px-[7px] [&_span]:py-0.5 [&_span]:text-[12px] [&_span]:text-secondary-foreground">
              {project.technologies.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
        )}
        {!!project.collabs.length && (
          <section
            className="mt-9 [&_h2]:mt-0 [&_h2]:mb-4 [&_h2]:text-[14px] [&_h2]:font-[450] [&_h2]:text-muted-foreground [&>p]:text-[15px] [&>p]:leading-[1.9] [&>p]:text-secondary-foreground"
            aria-labelledby="collaborators-title"
          >
            <h2 id="collaborators-title">built together with</h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.collabs.map((name) => (
                <a
                  href={`https://github.com/${name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
                  key={name}
                >
                  @{name}
                  <ArrowUpRightIcon size={13} />
                </a>
              ))}
            </div>
          </section>
        )}
        {!!project.workflow?.length && (
          <section
            className="mt-9 [&_h2]:mt-0 [&_h2]:mb-4 [&_h2]:text-[14px] [&_h2]:font-[450] [&_h2]:text-muted-foreground [&>p]:text-[15px] [&>p]:leading-[1.9] [&>p]:text-secondary-foreground"
            aria-labelledby="workflow-title"
          >
            <h2 id="workflow-title">how it works</h2>
            <ol className="grid list-none grid-cols-4 gap-2 p-0 [&_li]:rounded-[18px] [&_li]:bg-card [&_li]:p-[17px] [&_li]:[corner-shape:squircle] [&_span]:text-[12px] [&_span]:text-muted-foreground [&_p]:mt-3 [&_p]:text-[14px] [&_p]:leading-[1.6] [@media(max-width:640px)]:grid-cols-2">
              {project.workflow.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
        {!!project.features?.length && (
          <section
            className="mt-9 [&_h2]:mt-0 [&_h2]:mb-4 [&_h2]:text-[14px] [&_h2]:font-[450] [&_h2]:text-muted-foreground [&>p]:text-[15px] [&>p]:leading-[1.9] [&>p]:text-secondary-foreground"
            aria-labelledby="features-title"
          >
            <h2 id="features-title">a closer look</h2>
            <dl className="[&>div]:grid [&>div]:grid-cols-[150px_1fr] [&>div]:gap-5 [&>div]:py-[18px] [&>div]:text-[14px] [&_dt]:text-foreground [&_dd]:leading-[1.8] [&_dd]:text-secondary-foreground [@media(max-width:640px)]:[&>div]:grid-cols-1 [@media(max-width:640px)]:[&>div]:gap-1.5">
              {project.features.map((feature) => (
                <div key={feature.title}>
                  <dt>{feature.title}</dt>
                  <dd>{feature.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {!!project.images?.length && (
          <div className="mt-9 grid gap-[18px] [&_img]:w-full [&_img]:rounded-3xl [&_img]:[corner-shape:squircle]">
            {project.images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                loading="lazy"
              />
            ))}
          </div>
        )}
        <div className="mt-11 pt-[25px]">
          <Link
            href="/projects"
            className="relative inline-flex w-fit items-center gap-1.5 text-[14px]! text-secondary-foreground! after:absolute after:-bottom-px after:left-0 after:right-5 after:h-px after:origin-left after:scale-x-0 after:bg-underline after:transition-transform after:duration-[220ms] after:ease-portfolio after:content-[''] [&_svg]:transition-transform [&_svg]:duration-[220ms] [&_svg]:ease-portfolio pointer-fine:hover:after:scale-x-100 pointer-fine:hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:translate-none"
          >
            <ArrowLeftIcon size={14} />
            back to projects
          </Link>
        </div>
      </article>
    </main>
  );
}
