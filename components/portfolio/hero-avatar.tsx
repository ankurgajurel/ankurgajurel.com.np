"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HeroAvatar({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;

    function dismissOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !trigger.current?.contains(event.target)
      ) {
        setAnimate(true);
        setExpanded(false);
      }
    }

    function dismissWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAnimate(false);
        setExpanded(false);
      }
    }

    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissWithEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissWithEscape);
    };
  }, [expanded]);

  return (
    <button
      ref={trigger}
      type="button"
      className="size-20 shrink-0 cursor-zoom-in rounded-[22px] [corner-shape:squircle] transition-[width,height,border-radius] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] aria-pressed:size-40 aria-pressed:cursor-zoom-out aria-pressed:rounded-[44px] data-[animate=false]:duration-0"
      data-animate={animate}
      aria-label={`${name}'s photo, double size`}
      aria-pressed={expanded}
      onClick={(event) => {
        setAnimate(event.detail !== 0);
        setExpanded((value) => !value);
      }}
    >
      <Image
        className="size-full rounded-[inherit] object-cover saturate-75 [corner-shape:squircle]"
        src={src}
        width={160}
        height={160}
        sizes={expanded ? "160px" : "80px"}
        alt={name}
        priority
      />
    </button>
  );
}
