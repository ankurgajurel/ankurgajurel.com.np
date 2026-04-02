import { cache } from "react";

export interface GalleryMedia {
  id: number;
  type: "image" | "video";
  src: string;
  caption: string;
  isMuted?: boolean;
}

export interface GalleryFolder {
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

async function fetchCustomGalleryJson(
  endpoint: string
): Promise<GalleryData | null> {
  const res = await fetch(endpoint, {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) return null;

  const payload: unknown = await res.json();
  if (!isGalleryData(payload)) return null;

  return payload;
}

/** Pexels Search API — https://www.pexels.com/api/documentation/#photos-search */
interface PexelsSearchResponse {
  photos?: Array<{
    id: number;
    photographer?: string;
    src?: { large?: string; landscape?: string; portrait?: string };
  }>;
}

async function fetchPexelsGallery(): Promise<GalleryData | null> {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (!key) return null;

  const query =
    process.env.PEXELS_GALLERY_QUERY?.trim() || "nature landscape";

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "12");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: { Authorization: key },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as PexelsSearchResponse;
  const photos = json.photos;
  if (!photos?.length) return null;

  let id = 1;
  const general: GalleryMedia[] = [];
  for (const photo of photos) {
    const src =
      photo.src?.large ?? photo.src?.landscape ?? photo.src?.portrait;
    if (!src) continue;
    general.push({
      id: id++,
      type: "image",
      src,
      caption: photo.photographer
        ? `Photo by ${photo.photographer}`
        : "Photo",
    });
  }

  if (general.length === 0) return null;

  return { general, folders: {} };
}

/**
 * Zero-config demo gallery (Lorem Picsum). No API key.
 * Pinterest has no simple public image API; use your own JSON + image URLs if you host there.
 */
function buildPicsumFallbackGallery(): GalleryData {
  let id = 1;
  const mk = (seed: string, caption: string): GalleryMedia => ({
    id: id++,
    type: "image",
    src: `https://picsum.photos/seed/${seed}/1200/900`,
    caption,
  });

  const general = [1, 2, 3, 4, 5, 6].map((i) =>
    mk(
      `sleek-demo-g-${i}`,
      "Sample image — set GALLERY_JSON_ENDPOINT or PEXELS_API_KEY for your photos."
    )
  );

  const folderItems = (seedPrefix: string, label: string) =>
    [1, 2, 3, 4].map((j) =>
      mk(`${seedPrefix}-${j}`, `${label} — sample (replace via env)`)
    );

  return {
    general,
    folders: {
      "sample-one": {
        name: "sample one",
        cover: "https://picsum.photos/seed/sleek-demo-f1-cover/800/800",
        items: folderItems("sleek-demo-f1", "sample one"),
      },
      "sample-two": {
        name: "sample two",
        cover: "https://picsum.photos/seed/sleek-demo-f2-cover/800/800",
        items: folderItems("sleek-demo-f2", "sample two"),
      },
    },
  };
}

/**
 * Gallery resolution order (fork-friendly):
 * 1. `GALLERY_JSON_ENDPOINT` — your JSON (Cloudinary, Google Photos URLs, etc.)
 * 2. `PEXELS_API_KEY` — Pexels Search API (optional `PEXELS_GALLERY_QUERY`)
 * 3. Built-in Picsum placeholders — always works with no env
 */
export const fetchGalleryData = cache(async (): Promise<GalleryData> => {
  const endpoint = process.env.GALLERY_JSON_ENDPOINT?.trim();
  if (endpoint) {
    const custom = await fetchCustomGalleryJson(endpoint);
    if (custom) return custom;
  }

  const pexels = await fetchPexelsGallery();
  if (pexels) return pexels;

  return buildPicsumFallbackGallery();
});

/**
 * Transform a Cloudinary URL into a 1200x630 auto-cropped OG image.
 * Works for both image and video URLs (videos get a thumbnail via .jpg extension).
 * Other hosts (Pexels, Picsum) are returned unchanged.
 */
export function toOgImage(src: string): string {
  const match = src.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(v\d+\/.+)$/
  );
  if (!match) return src;

  const [, base, path] = match;
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
