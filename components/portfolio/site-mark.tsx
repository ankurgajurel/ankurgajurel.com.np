"use client";

import { useState } from "react";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";

export default function SiteMark({
  url,
  name,
  size = 22,
}: {
  url?: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const parsed = url ? new URL(url, "https://ankurgajurel.com.np") : null;
  if (parsed?.hostname === "github.com")
    return <GithubLogoIcon size={size} weight="fill" aria-hidden="true" />;
  if (!parsed || failed)
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center font-semibold leading-none tracking-normal text-secondary-foreground uppercase"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.68) }}
        aria-hidden="true"
      >
        {name.trim().slice(0, 1).toUpperCase()}
      </span>
    );
  const hostname = parsed.hostname.replace(/^staging\./, "");
  const source =
    parsed.hostname === "ankurgajurel.com.np"
      ? "/icon.svg"
      : `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  // Favicons have their own host formats; render at native icon size, with a text fallback.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      width={size}
      height={size}
      alt=""
      onError={() => setFailed(true)}
      className="shrink-0 rounded-[3px] object-contain"
    />
  );
}
