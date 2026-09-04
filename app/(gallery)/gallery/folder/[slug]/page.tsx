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
  const folder = data?.folders[slug];
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
  if (!galleryData) notFound();

  const folder = galleryData.folders[slug];

  if (!folder) {
    notFound();
  }

  return (
    <main
      id="main-content"
      className="mx-auto w-[min(900px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <header className="mb-[38px] [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-[30px] [&_h1]:font-[450] [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.045em] [&_h1>span]:ml-3 [&_h1>span]:align-middle [&_h1>span]:text-[14px] [&_h1>span]:font-normal [&_h1>span]:tracking-normal [&_h1>span]:text-muted-foreground [&>p:last-child]:max-w-[490px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-secondary-foreground max-w-170">
        <Link
          href="/gallery"
          className="text-xs text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← back to gallery
        </Link>
        <h1>{folder.name}</h1>
        <p className="text-muted-foreground text-xs">
          {folder.items.length} items
        </p>
      </header>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <GalleryMasonry items={folder.items} eagerCount={3} />
      </Suspense>
    </main>
  );
}

export async function generateStaticParams() {
  const galleryData = await fetchGalleryData();
  if (!galleryData) return [];

  return Object.keys(galleryData.folders).map((slug) => ({ slug }));
}
