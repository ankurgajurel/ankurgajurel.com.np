import { siteConfig } from "@/config/siteConfig";
import { experiences } from "@/data/experience";
import { user } from "@/data/general";
import type { Project } from "@/data/projects";
import { seoProfile } from "@/data/seo";
import { skills } from "@/data/skills";

export function absoluteUrl(path = "") {
  if (!path) return siteConfig.url;
  if (path.startsWith("http")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function projectDescription(project: Project) {
  return (
    project.description ||
    project.content ||
    `${project.name} is a software engineering project by ${user.legalName}.`
  );
}

export function projectKeywords(project: Project) {
  return [
    project.name,
    project.type,
    ...(project.technologies || []),
    ...seoProfile.targetQueries.slice(0, 8),
  ].filter(Boolean);
}

export function getPersonJsonLd() {
  const latestExperience = experiences
    .filter((experience) => !experience.hidden)
    .sort((a, b) => b.id - a.id)[0];

  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: user.legalName,
    alternateName: [user.name, user.genericUsername],
    description: seoProfile.longDescription,
    url: siteConfig.url,
    image: user.avatar,
    jobTitle: [
      "Remote full-stack engineer",
      "Generalist software engineer",
      "Freelance engineer",
      "AI product engineer",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bhaktapur",
      addressCountry: "Nepal",
      postalCode: user.postalCode,
    },
    homeLocation: {
      "@type": "Place",
      name: "Bhaktapur, Nepal",
    },
    worksFor: latestExperience
      ? {
          "@type": "Organization",
          name: latestExperience.company,
          url: latestExperience.website,
        }
      : undefined,
    sameAs: [
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
    knowsAbout: [
      ...seoProfile.specialties,
      ...seoProfile.targetQueries,
      ...skills.flatMap((skill) => skill.items),
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Software engineer",
      occupationLocation: {
        "@type": "Country",
        name: "Nepal",
      },
      skills: [...seoProfile.specialties, ...skills.flatMap((skill) => skill.items)].join(
        ", "
      ),
    },
    makesOffer: seoProfile.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
      areaServed: "Worldwide",
      availability: "https://schema.org/InStock",
    })),
  };
}

export function getWebsiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
  };
}

export function getProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profile-page`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    dateModified: siteConfig.updatedAt,
    inLanguage: "en",
    mainEntity: {
      "@id": `${siteConfig.url}/#person`,
    },
    about: seoProfile.targetQueries,
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function jsonLdGraph(items: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": items,
  };
}
