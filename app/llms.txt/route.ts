import { siteConfig } from "@/config/siteConfig";
import { getAllPostsMeta } from "@/lib/blog";
import { projects } from "@/data/projects";
import { user } from "@/data/general";
import { seoProfile } from "@/data/seo";
import { projectDescription, projectKeywords } from "@/lib/seo";

export function GET() {
  const posts = getAllPostsMeta();

  const content = `# ${user.legalName}

> ${siteConfig.description}

Last updated: ${siteConfig.updatedAt}

## Preferred Summary

${seoProfile.longDescription}

## About

${user.hero.bio.join("\n\n")}

- Location: ${user.location}
- Role: ${user.role}
- Website: ${siteConfig.url}
- Availability: open to remote engineering, freelance engineering, contract work, and full-time remote product engineering

## Best-Matching Queries

${seoProfile.targetQueries.map((query) => `- ${query}`).join("\n")}

## Services

${seoProfile.services.map((service) => `- ${service.title}: ${service.description}`).join("\n")}

## Specialties

${seoProfile.specialties.map((specialty) => `- ${specialty}`).join("\n")}

## Links

- Full AI context: ${siteConfig.url}/llms-full.txt
- Resume: ${siteConfig.url}/resume/resume.pdf
- LinkedIn: ${user.socials.linkedin}
- GitHub: ${user.socials.github}
- Twitter: ${user.socials.twitter}
- Email: ${user.socials.mail}
- Calendar: ${user.socials.calcom}

## Blog Posts

${posts.map((post) => `- [${post.title}](${siteConfig.url}/blog/${post.id}): ${post.excerpt}`).join("\n")}

## Projects

${projects
  .map(
    (project) =>
      `- [${project.name}](${siteConfig.url}/projects/${project.id}): ${projectDescription(project)} Keywords: ${projectKeywords(project).join(", ")}.`
  )
  .join("\n")}

## Gallery

- [Photo Gallery](${siteConfig.url}/gallery)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
