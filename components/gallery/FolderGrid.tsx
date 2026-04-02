import Link from "next/link";
import GalleryImage from "@/components/gallery/GalleryImage";
import type { GalleryFolderListItem } from "@/lib/gallery";

interface FolderGridProps {
  folders: GalleryFolderListItem[];
}

export default function FolderGrid({ folders }: FolderGridProps) {
  if (folders.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-14 md:mt-16">
      <h3 className="text-2xl sm:text-3xl mb-4 sm:mb-6">folders</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/gallery/folder/${folder.id}`}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
              <GalleryImage
                src={folder.cover}
                alt={folder.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                wrapperClassName="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 md:p-4 text-white">
                <p className="font-medium text-sm sm:text-base md:text-lg leading-tight line-clamp-1">
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
