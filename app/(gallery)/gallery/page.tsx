import { Suspense } from "react";
import FolderGrid from "@/components/gallery/FolderGrid";
import { fetchGalleryData, getGalleryFolderList } from "@/lib/gallery";
import GalleryMasonry from "@/components/gallery/GalleryMasonry";

export default async function Gallery() {
  const galleryData = await fetchGalleryData();

  return (
    <main
      id="main-content"
      className="mx-auto w-[min(900px,calc(100%-40px))] pt-[74px] [@media(max-width:640px)]:pt-12"
    >
      <header className="mb-[38px] [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-[30px] [&_h1]:font-[450] [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.045em] [&_h1>span]:ml-3 [&_h1>span]:align-middle [&_h1>span]:text-[14px] [&_h1>span]:font-normal [&_h1>span]:tracking-normal [&_h1>span]:text-muted-foreground [&>p:last-child]:max-w-[490px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-secondary-foreground max-w-170">
        <p className="mt-0 mb-3.5 text-[13px] text-muted-foreground">
          away from the screen
        </p>
        <h1>gallery</h1>
        <p>
          places i’ve been, people i’ve met, and little moments worth keeping.
        </p>
      </header>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        {galleryData ? (
          <GalleryMasonry items={galleryData.general} eagerCount={3} />
        ) : (
          <p className="text-sm text-muted-foreground">
            the gallery is taking a moment to load. please check back soon.
          </p>
        )}
      </Suspense>

      {galleryData && (
        <FolderGrid folders={getGalleryFolderList(galleryData)} />
      )}
    </main>
  );
}
