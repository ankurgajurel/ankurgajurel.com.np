import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { fetchGalleryData, toOgImage } from "@/lib/gallery";
import { siteMetadata, siteConfig } from "@/config/siteConfig";
import GalleryMasonry from "@/components/gallery/GalleryMasonry";

interface FolderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: FolderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchGalleryData();
  const folder = data.folders[slug];
  if (!folder) return {};

  const title = `${folder.name} | gallery`;
  const description = `${folder.name} — ${folder.items.length} photos & videos`;
  const rawSrc =
    folder.cover ||
    folder.items.find((i) => i.type === "image")?.src ||
    folder.items[0]?.src;
  const ogImage = rawSrc ? toOgImage(rawSrc) : undefined;

  return {
    title,
    description,
    openGraph: {
      ...siteMetadata.openGraph,
      type: "website",
      title,
      description,
      url: `${siteConfig.url}/gallery/folder/${slug}`,
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: folder.name }],
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

export default async function FolderPage({ params }: FolderPageProps) {
  const { slug } = await params;
  const galleryData = await fetchGalleryData();
  const folder = galleryData.folders[slug];

  if (!folder) {
    notFound();
  }

  return (
    <section className="container p-4 my-6 sm:my-10 md:my-16 lg:my-20">
      <div className="mb-5 sm:mb-8">
        <Link
          href="/gallery"
          className="text-sm text-gray-600 hover:text-black dark:hover:text-white transition-colors mb-2 inline-block"
        >
          ← back to gallery
        </Link>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          {folder.name}
        </h2>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          {folder.items.length} items
        </p>
      </div>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <GalleryMasonry items={folder.items} eagerCount={3} />
      </Suspense>
    </section>
  );
}

export async function generateStaticParams() {
  const galleryData = await fetchGalleryData();
  return Object.keys(galleryData.folders).map((slug) => ({ slug }));
}
