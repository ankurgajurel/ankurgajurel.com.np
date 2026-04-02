import { Suspense } from "react";
import FolderGrid from "@/components/gallery/FolderGrid";
import { fetchGalleryData, getGalleryFolderList } from "@/lib/gallery";
import GalleryMasonry from "@/components/gallery/GalleryMasonry";

export default async function Gallery() {
  const galleryData = await fetchGalleryData();

  return (
    <section className="container p-4 my-6 sm:my-10 md:my-16 lg:my-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 sm:mb-8">
        gallery
      </h2>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <GalleryMasonry items={galleryData.general} eagerCount={3} />
      </Suspense>

      <FolderGrid folders={getGalleryFolderList(galleryData)} />
    </section>
  );
}
