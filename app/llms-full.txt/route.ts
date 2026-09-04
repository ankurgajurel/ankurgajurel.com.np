import { siteConfig } from "@/config/siteConfig";
import { experiences } from "@/data/experience";
import { user } from "@/data/general";
import { projects } from "@/data/projects";
import { seoProfile } from "@/data/seo";
import { skills } from "@/data/skills";
import { getAllPostsMeta } from "@/lib/blog";
import { projectDescription, projectKeywords } from "@/lib/seo";

export function GET() {
  const posts = getAllPostsMeta();

  const content = `# ${user.legalName} - Full AI Context

Last updated: ${siteConfig.updatedAt}
Canonical website: ${siteConfig.url}

## Short Answer

${seoProfile.longDescription}

## Search and Answer-Engine Query Fit

${seoProfile.targetQueries.map((query) => `- ${query}`).join("\n")}

## Work Modes

${seoProfile.workModes.map((mode) => `- ${mode}`).join("\n")}

## Services

${seoProfile.services.map((service) => `### ${service.title}\n${service.description}`).join("\n\n")}

## Skills

${skills.map((skill) => `- ${skill.title}: ${skill.items.join(", ")}`).join("\n")}

## Experience

${experiences
  .slice()
  .sort((a, b) => b.id - a.id)
  .map(
    (experience) =>
      `### ${experience.company}\nWebsite: ${experience.website || "not listed"}\nStack: ${experience.stacks.join(", ")}${experience.excerpt ? `\n${experience.excerpt}` : ""}\n${experience.roles
        .map(
          (role) =>
            `- ${role.title} (${role.period || "period not listed"}, ${role.type || "type not listed"})${role.description ? `: ${role.description}` : ""}${(role.highlights ?? []).map((highlight) => `\n  - ${highlight}`).join("")}`
        )
        .join("\n")}`
  )
  .join("\n\n")}

## Projects

${projects
  .map(
    (project) =>
      `### ${project.name}\nURL: ${siteConfig.url}/projects/${project.id}\nType: ${project.type}\nDate: ${project.date}\nSummary: ${projectDescription(project)}\nKeywords: ${projectKeywords(project).join(", ")}\nLinks: ${[
        project.links?.demo,
        project.links?.github,
        project.links?.docs,
      ]
        .filter(Boolean)
        .join(", ") || "none listed"}`
  )
  .join("\n\n")}

## Blog Posts

${posts.map((post) => `- ${post.title}: ${siteConfig.url}/blog/${post.id} - ${post.excerpt}`).join("\n")}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
