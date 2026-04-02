type LqipResult =
  | { type: "lqip"; url: string }
  | { type: "shimmer" };

const GOOGLE_PHOTOS_HOST = "lh3.googleusercontent.com";
const CLOUDINARY_RE = /\/image\/upload\//;
const CLOUDINARY_VIDEO_RE = /\/video\/upload\//;

export function getLqipUrl(
  src: string,
  mediaType: "image" | "video"
): LqipResult {
  try {
    const url = new URL(src);

    // Picsum seed URLs: same path with tiny dimensions for blur placeholder
    if (url.hostname === "picsum.photos" && src.includes("/seed/")) {
      const lqip = src.replace(/\/(\d+)\/(\d+)$/, "/20/20");
      return { type: "lqip", url: lqip };
    }

    // Google Photos: append =w20 for a tiny thumbnail
    if (url.hostname === GOOGLE_PHOTOS_HOST) {
      // Strip any existing size param and append tiny width
      const base = url.href.replace(/=w\d+.*$/, "");
      return { type: "lqip", url: `${base}=w20` };
    }

    // Cloudinary images: insert low-quality blur transforms
    if (mediaType === "image" && CLOUDINARY_RE.test(src)) {
      const lqip = src.replace(
        /\/image\/upload\//,
        "/image/upload/w_20,q_auto:low,e_blur:800/"
      );
      return { type: "lqip", url: lqip };
    }

    // Cloudinary videos: derive a blurred still frame
    if (mediaType === "video" && CLOUDINARY_VIDEO_RE.test(src)) {
      const lqip = src
        .replace(/\/video\/upload\//, "/video/upload/w_20,q_auto:low,e_blur:800/")
        .replace(/\.[^.]+$/, ".jpg");
      return { type: "lqip", url: lqip };
    }
  } catch {
    // Invalid URL — fall through to shimmer
  }

  return { type: "shimmer" };
}

export function getVideoPosterUrl(src: string): string | undefined {
  try {
    // Cloudinary videos: derive a full-size poster frame
    if (CLOUDINARY_VIDEO_RE.test(src)) {
      return src
        .replace(/\/video\/upload\//, "/video/upload/so_0,f_jpg,q_auto/")
        .replace(/\.[^.]+$/, ".jpg");
    }

    // Google Photos video — no poster derivation available
  } catch {
    // Invalid URL
  }

  return undefined;
}
