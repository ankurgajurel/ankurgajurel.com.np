"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import VideoPlayer from "@/components/gallery/VideoPlayer";
import GalleryImage from "@/components/gallery/GalleryImage";
import { getVideoPosterUrl } from "@/lib/gallery-placeholder";
import type { GalleryMedia } from "@/lib/gallery";
import { siteConfig } from "@/config/siteConfig";
import { user } from "@/data/general";

interface GalleryMasonryProps {
  items: GalleryMedia[];
  eagerCount?: number;
}

export default function GalleryMasonry({
  items,
  eagerCount = 0,
}: GalleryMasonryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMedia = searchParams.get("media");
  const activeIndex = useMemo(() => {
    if (!activeMedia) return -1;
    return items.findIndex((item) => `${item.type}-${item.id}` === activeMedia);
  }, [items, activeMedia]);
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;

  const setModalQuery = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("media", value);
      } else {
        params.delete("media");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );

  const openModal = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      setModalQuery(`${item.type}-${item.id}`);
    },
    [items, setModalQuery],
  );

  const closeModal = useCallback(() => setModalQuery(null), [setModalQuery]);

  const goToPrev = useCallback(() => {
    if (activeIndex <= 0) return;
    openModal(activeIndex - 1);
  }, [activeIndex, openModal]);

  const goToNext = useCallback(() => {
    if (activeIndex < 0 || activeIndex >= items.length - 1) return;
    openModal(activeIndex + 1);
  }, [activeIndex, items.length, openModal]);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalOpen = activeItem !== null;
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement;
    const modal = modalRef.current;
    modal?.querySelector<HTMLButtonElement>("button")?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !modal) return;
      const controls = [
        ...modal.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], video[controls], [tabindex="0"]',
        ),
      ];
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", trapFocus);
    return () => {
      window.removeEventListener("keydown", trapFocus);
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus({ preventScroll: true });
    };
  }, [modalOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (activeItem === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, closeModal, goToPrev, goToNext]);

  // Swipe gesture handling for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    },
    [goToPrev, goToNext],
  );

  const tweetUrl = useMemo(() => {
    if (!activeItem) return "#";
    const text = `${activeItem.caption}\n\n${activeItem.src}\n\nfrom: ${siteConfig.url}\n\nby: @${user.genericUsername}`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }, [activeItem]);

  return (
    <>
      {/* Masonry grid - removed space-y-4 to fix double spacing with mb-4 on items */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <button
            key={`${item.type}-${item.id}-${index}`}
            type="button"
            className="mb-3 sm:mb-4 rounded-3xl [corner-shape:squircle] break-inside-avoid overflow-hidden bg-card relative w-full text-left cursor-zoom-in"
            onClick={() => openModal(index)}
          >
            {item.type === "image" ? (
              <div className="relative w-full group">
                <GalleryImage
                  src={item.src}
                  alt={item.caption}
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto transition-transform duration-250 [@media(hover:hover)]:group-hover:scale-[1.02]"
                  loading={index < eagerCount ? "eager" : "lazy"}
                  priority={index < eagerCount}
                  quality={85}
                />
              </div>
            ) : (
              <div className="relative w-full">
                <VideoPlayer
                  item={item}
                  onActivate={() => openModal(index)}
                  poster={getVideoPosterUrl(item.src)}
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
              <p className="text-xs sm:text-sm font-medium line-clamp-2">
                {item.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal / Lightbox - uses dvh to handle mobile browser chrome */}
      {activeItem && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.caption}
          className="fixed inset-0 h-dvh z-50 bg-black flex flex-col"
          onClick={closeModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top bar with close + counter */}
          <div className="relative z-20 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 shrink-0">
            <span className="text-white/60 text-xs sm:text-sm">
              {activeIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={closeModal}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <XIcon size={22} aria-hidden="true" />
            </button>
          </div>

          {/* Media area - fills remaining space */}
          <div
            className="relative flex-1 min-h-0 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev button */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 bg-black/40 backdrop-blur-sm text-white/80 hover:text-white rounded-full hover:bg-black/60 transition-colors"
                aria-label="Previous"
              >
                <CaretLeftIcon size={22} aria-hidden="true" />
              </button>
            )}

            {/* Next button */}
            {activeIndex < items.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 bg-black/40 backdrop-blur-sm text-white/80 hover:text-white rounded-full hover:bg-black/60 transition-colors"
                aria-label="Next"
              >
                <CaretRightIcon size={22} aria-hidden="true" />
              </button>
            )}

            {/* Image/Video content */}
            <div className="relative w-full h-full max-w-6xl mx-auto px-2 sm:px-8">
              {activeItem.type === "image" ? (
                <GalleryImage
                  key={activeItem.src}
                  src={activeItem.src}
                  alt={activeItem.caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  quality={95}
                  priority
                  wrapperClassName="relative w-full h-full"
                  placeholderFit="contain"
                />
              ) : (
                <VideoPlayer
                  item={activeItem}
                  observeVisibility={false}
                  wrapperClassName="relative h-full w-full flex items-center justify-center overflow-hidden"
                  fit="contain"
                  className="max-h-full max-w-full object-contain"
                  poster={getVideoPosterUrl(activeItem.src)}
                />
              )}
            </div>
          </div>

          {/* Bottom bar - always visible, outside the media area */}
          <div
            className="relative z-20 shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 bg-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs sm:text-sm text-white/80 line-clamp-1">
              {activeItem.caption}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={activeItem.src}
                download
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs sm:text-sm bg-white/15 text-white hover:bg-white/25 rounded-md transition-colors"
              >
                download
              </a>
              <a
                href={tweetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs sm:text-sm bg-sky-500/80 text-white hover:bg-sky-600 rounded-md transition-colors"
              >
                tweet
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
