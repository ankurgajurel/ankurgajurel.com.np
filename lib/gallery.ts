import { cache } from "react";

export interface GalleryMedia {
  id: number;
  type: "image" | "video";
  src: string;
  caption: string;
  isMuted?: boolean;
}

interface GalleryFolder {
  name: string;
  cover: string;
  items: GalleryMedia[];
}

export interface GalleryData {
  general: GalleryMedia[];
  folders: Record<string, GalleryFolder>;
}

export interface GalleryFolderListItem extends GalleryFolder {
  id: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGalleryMedia(value: unknown): value is GalleryMedia {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    (value.type === "image" || value.type === "video") &&
    typeof value.src === "string" &&
    typeof value.caption === "string" &&
    (value.isMuted === undefined || typeof value.isMuted === "boolean")
  );
}

function isGalleryFolder(value: unknown): value is GalleryFolder {
  if (!isRecord(value)) return false;
  if (typeof value.name !== "string") return false;
  if (typeof value.cover !== "string") return false;
  if (!Array.isArray(value.items)) return false;

  return value.items.every(isGalleryMedia);
}

function isGalleryData(value: unknown): value is GalleryData {
  if (!isRecord(value)) return false;
  if (!Array.isArray(value.general)) return false;
  if (!isRecord(value.folders)) return false;

  if (!value.general.every(isGalleryMedia)) return false;

  return Object.values(value.folders).every(isGalleryFolder);
}

export const fetchGalleryData = cache(async (): Promise<GalleryData | null> => {
  const endpoint = process.env.GALLERY_JSON_ENDPOINT;
  if (!endpoint) return null;

  const res = await fetch(endpoint, {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) return null;

  const payload: unknown = await res.json();
  if (!isGalleryData(payload)) return null;

  return payload;
});

/**
 * Transform a Cloudinary URL into a 1200x630 auto-cropped OG image.
 * Works for both image and video URLs (videos get a thumbnail via .jpg extension).
 */
export function toOgImage(src: string): string {
  const match = src.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(v\d+\/.+)$/
  );
  if (!match) return src;

  const [, base, path] = match;
  // Strip existing extension for videos and replace with .jpg
  const jpgPath = path.replace(/\.(mp4|mov|webm|avi)$/i, ".jpg");
  return `${base}c_fill,w_1200,h_630,g_auto,f_jpg,q_80/${jpgPath}`;
}

export function getGalleryFolderList(
  data: GalleryData
): GalleryFolderListItem[] {
  return Object.entries(data.folders).map(([id, folder]) => ({
    id,
    ...folder,
  }));
}
