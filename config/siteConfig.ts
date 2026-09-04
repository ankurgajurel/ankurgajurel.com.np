import { user } from "@/data/general";
import { Metadata } from "next";
import { seoProfile } from "@/data/seo";

export const siteConfig = {
  name: user.legalName,
  title: `${user.legalName} - Remote Full-Stack Engineer in Nepal`,
  description: seoProfile.shortDescription,
  url: "https://ankurgajurel.com.np",
  ogImage: "/og.png",
  updatedAt: seoProfile.updatedAt,
  links: {
    twitter: "https://twitter.com/ankurgajurel",
    github: "https://github.com/ankurgajurel",
    linkedin: "https://linkedin.com/in/ankurgajurel",
  },
  creator: "@ankurgajurel",
  authors: [
    {
      name: user.legalName,
      url: "https://ankurgajurel.com.np",
    },
  ],
  keywords: [
    user.legalName,
    ...seoProfile.targetQueries,
    ...seoProfile.specialties,
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "AWS",
  ],
};

export const siteMetadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} - ${siteConfig.description}`,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    site: "@ankurgajurel",
    creator: "@ankurgajurel",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.ico",
  },
};
