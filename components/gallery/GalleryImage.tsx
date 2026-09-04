"use client";

import { useState, useCallback, useMemo } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { getLqipUrl } from "@/lib/gallery-placeholder";

interface GalleryImageProps extends Omit<ImageProps, "onLoad"> {
  wrapperClassName?: string;
  mediaType?: "image" | "video";
  placeholderFit?: "cover" | "contain";
}

export default function GalleryImage({
  src,
  alt,
  wrapperClassName,
  className,
  mediaType = "image",
  placeholderFit = "cover",
  ...rest
}: GalleryImageProps) {
  const [loaded, setLoaded] = useState(false);

  const lqip = useMemo(
    () => getLqipUrl(typeof src === "string" ? src : "", mediaType),
    [src, mediaType]
  );

  const handleFullLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={cn("relative", wrapperClassName)}>
      {/* LQIP blur placeholder */}
      {lqip.type === "lqip" && (
        <div
          className={cn(
            "absolute inset-0 overflow-hidden transition-opacity duration-300",
            loaded ? "opacity-0" : "opacity-100"
          )}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lqip.url}
            loading={rest.priority ? "eager" : rest.loading ?? "lazy"}
            decoding="async"
            alt=""
            className={cn(
              "w-full h-full",
              placeholderFit === "contain" ? "object-contain" : "object-cover"
            )}
            style={{
              filter: "blur(20px)",
              transform: placeholderFit === "cover" ? "scale(1.2)" : undefined,
            }}
          />
        </div>
      )}

      {/* Full image */}
      <Image
        src={src}
        alt={alt ?? ""}
        className={cn(
          "transition-opacity duration-400 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleFullLoad}
        {...rest}
      />
    </div>
  );
}
