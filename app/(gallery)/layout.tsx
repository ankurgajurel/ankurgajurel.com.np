import { Metadata } from "next";
import { siteMetadata, siteConfig } from "@/config/siteConfig";
import { fetchGalleryData, toOgImage } from "@/lib/gallery";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchGalleryData();
  const firstSrc = data.general.find((i) => i.type === "image")?.src;
  const ogImage = firstSrc ? toOgImage(firstSrc) : null;
  const description =
    "a collection of my personal photos and videos from various adventures.";
  const title = `gallery | ${siteConfig.name}`;

  return {
    ...siteMetadata,
    title,
    description,
    openGraph: {
      ...siteMetadata.openGraph,
      type: "website",
      title,
      description,
      url: `${siteConfig.url}/gallery`,
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: "gallery" }],
      }),
    },
    twitter: {
      ...siteMetadata.twitter,
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
