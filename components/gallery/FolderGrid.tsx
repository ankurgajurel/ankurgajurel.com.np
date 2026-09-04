import Link from "next/link";
import GalleryImage from "@/components/gallery/GalleryImage";
import type { GalleryFolderListItem } from "@/lib/gallery";

interface FolderGridProps {
  folders: GalleryFolderListItem[];
}

export default function FolderGrid({ folders }: FolderGridProps) {
  return (
    <div className="mt-10 sm:mt-14 md:mt-16">
      <h3 className="text-sm text-muted-foreground mb-5">folders</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/gallery/folder/${folder.id}`}
            className="group cursor-pointer"
          >
            <div className="rounded-3xl [corner-shape:squircle] relative aspect-square overflow-hidden bg-card">
              <GalleryImage
                src={folder.cover}
                alt={folder.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-full object-cover transition-transform duration-250 [@media(hover:hover)]:group-hover:scale-[1.02]"
                wrapperClassName="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 md:p-4 text-white">
                <p className="font-medium text-xs sm:text-sm leading-tight line-clamp-1">
                  {folder.name}
                </p>
                <p className="text-xs sm:text-sm opacity-80">
                  {folder.items.length} items
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
