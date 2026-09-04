"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { CornersOutIcon as Expand } from "@phosphor-icons/react/dist/ssr/CornersOut";
import { MonitorIcon as Monitor } from "@phosphor-icons/react/dist/ssr/Monitor";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { DeviceMobileIcon as Smartphone } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { TrashIcon as Trash2 } from "@phosphor-icons/react/dist/ssr/Trash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ALL_TIMEZONES, convertTime, formatTimeInTimezone, getCityFromTimezone, normalizeTimezone } from "@/lib/tools/timezones";
import { ToolButton } from "@/components/tools/tool-button";
import { ToolPanel, toolInputClassName, toolLabelClassName } from "@/components/tools/tool-shell";

type Clock = { id: string; timezone: string };
const initialClocks: Clock[] = ["America/New_York", "Europe/London", "Asia/Tokyo"].map((timezone) => ({ id: timezone, timezone }));

function setQuery(router: ReturnType<typeof useRouter>, pathname: string, searchParams: URLSearchParams, update: (next: URLSearchParams) => void) {
  const next = new URLSearchParams(searchParams.toString()); update(next);
  if (next.toString() !== searchParams.toString()) {
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }
}

function TimezoneSelect({ value, onChange, label, id }: { value: string; onChange: (value: string) => void; label: string; id: string }) {
  return <label><span className={toolLabelClassName}>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={toolInputClassName}>{ALL_TIMEZONES.map((timezone) => <option key={timezone} value={timezone}>{timezone.replace(/_/g, " ")}</option>)}</select></label>;
}

export function WorldClocks() {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const [now, setNow] = useState(() => new Date());
  const [from, setFrom] = useState(() => normalizeTimezone(searchParams.get("fromTimezone")) ?? "UTC");
  const [to, setTo] = useState(() => normalizeTimezone(searchParams.get("toTimezone")) ?? normalizeTimezone("Asia/Kathmandu") ?? "UTC");
  const [fromTime, setFromTime] = useState(() => searchParams.get("fromTime") ?? formatTimeInTimezone(new Date(), normalizeTimezone(searchParams.get("fromTimezone")) ?? "UTC"));
  const [toTime, setToTime] = useState(() => searchParams.get("toTime") ?? convertTime(searchParams.get("fromTime") ?? formatTimeInTimezone(new Date(), from), from, to));
  const [clocks, setClocks] = useState<Clock[]>(() => {
    const fromQuery = [...new Set((searchParams.get("tz") ?? "").split(",").map(normalizeTimezone).filter((timezone): timezone is string => Boolean(timezone)))];
    if (fromQuery.length) return fromQuery.map((timezone) => ({ id: timezone, timezone }));
    if (typeof window !== "undefined") { try { const saved = JSON.parse(window.localStorage.getItem("world-clocks") ?? "null"); if (Array.isArray(saved) && saved.every((item) => typeof item?.timezone === "string")) return saved.map((item) => ({ id: item.timezone, timezone: item.timezone })); } catch {} }
    return initialClocks;
  });
  const [newTimezone, setNewTimezone] = useState(() => normalizeTimezone("Asia/Kathmandu") ?? "UTC");

  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { window.localStorage.setItem("world-clocks", JSON.stringify(clocks)); }, [clocks]);
  useEffect(() => { setQuery(router, pathname, searchParams, (next) => { next.set("tz", clocks.map((clock) => clock.timezone).join(",")); }); }, [clocks, pathname, router, searchParams]);

  const updateConverter = (nextFrom: string, nextTo: string, nextFromTime: string, nextToTime: string, lastEdited: "from" | "to") => {
    setFrom(nextFrom); setTo(nextTo); setFromTime(nextFromTime); setToTime(nextToTime);
    setQuery(router, pathname, searchParams, (params) => { params.set("fromTimezone", nextFrom); params.set("toTimezone", nextTo); params.set("fromTime", nextFromTime); params.set("toTime", nextToTime); params.set("lastEditedField", lastEdited); });
  };
  const addClock = () => { const timezone = normalizeTimezone(newTimezone); if (!timezone || clocks.some((clock) => clock.timezone === timezone)) return; setClocks((current) => [...current, { id: timezone, timezone }]); };
  const removeClock = (timezone: string) => setClocks((current) => current.filter((clock) => clock.timezone !== timezone));

  return <div className="space-y-8"><ToolPanel><h2 className="mb-5 text-xl">world time converter</h2><div className="grid gap-5 md:grid-cols-2"><div className="space-y-4"><TimezoneSelect id="from-timezone" label="convert from" value={from} onChange={(value) => updateConverter(value, to, fromTime, convertTime(fromTime, value, to), "from")} /><label><span className={toolLabelClassName}>time</span><input id="from-time" type="time" value={fromTime} onChange={(event) => updateConverter(from, to, event.target.value, convertTime(event.target.value, from, to), "from")} className={toolInputClassName} /></label></div><div className="space-y-4"><TimezoneSelect id="to-timezone" label="convert to" value={to} onChange={(value) => updateConverter(from, value, fromTime, convertTime(fromTime, from, value), "from")} /><label><span className={toolLabelClassName}>time</span><input id="to-time" type="time" value={toTime} onChange={(event) => updateConverter(from, to, convertTime(event.target.value, to, from), event.target.value, "to")} className={toolInputClassName} /></label></div></div></ToolPanel><ToolPanel><div className="mb-5 flex flex-wrap items-baseline justify-between gap-3"><h2 className="text-xl">world clocks</h2><span className="text-sm text-foreground/60">updates every second</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{clocks.map((clock) => <article key={clock.id} className="border border-foreground/10 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium">{getCityFromTimezone(clock.timezone)}</h3><p className="mt-2 font-mono text-2xl tabular-nums">{now.toLocaleTimeString("en-US", { timeZone: clock.timezone, hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p><p className="mt-1 text-xs text-foreground/55">{clock.timezone}</p></div><ToolButton aria-label={`Remove ${clock.timezone}`} variant="quiet" className="min-h-0 p-2" onClick={() => removeClock(clock.timezone)}><Trash2 size={16} /></ToolButton></div></article>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"><label><span className="sr-only">Add a timezone</span><select value={newTimezone} onChange={(event) => setNewTimezone(event.target.value)} className={toolInputClassName}>{ALL_TIMEZONES.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}</select></label><ToolButton onClick={addClock}><Plus size={16} />add clock</ToolButton></div></ToolPanel></div>;
}

type Device = { label: string; width: number; height: number; icon: typeof Monitor };
const devices: Record<string, Device> = { "macbook-14": { label: 'MacBook 14"', width: 1512, height: 982, icon: Monitor }, "macbook-16": { label: 'MacBook 16"', width: 1728, height: 1117, icon: Monitor }, "iphone-14": { label: "iPhone 14", width: 390, height: 844, icon: Smartphone }, "iphone-14-pro": { label: "iPhone 14 Pro", width: 393, height: 852, icon: Smartphone }, "laptop-13": { label: 'Laptop 13"', width: 1280, height: 800, icon: Monitor }, "laptop-15": { label: 'Laptop 15"', width: 1366, height: 768, icon: Monitor } };

function normalizeUrl(value: string) { const trimmed = value.trim(); return !trimmed ? "" : /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`; }

export function ScreenTester() {
  const router = useRouter(); const pathname = usePathname(); const params = useSearchParams(); const [deviceKey, setDeviceKey] = useState("macbook-14"); const [url, setUrl] = useState(params.get("url") ?? "https://ankurgajurel.tech"); const [loadedUrl, setLoadedUrl] = useState(params.get("url") ?? "https://ankurgajurel.tech"); const [fullscreen, setFullscreen] = useState(false); const stageRef = useRef<HTMLDivElement>(null); const device = devices[deviceKey];
  useEffect(() => { const listener = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener("fullscreenchange", listener); return () => document.removeEventListener("fullscreenchange", listener); }, []);
  const load = (event: FormEvent) => { event.preventDefault(); const next = normalizeUrl(url); setLoadedUrl(next); setQuery(router, pathname, params, (search) => { if (next) search.set("url", next); else search.delete("url"); }); };
  const toggleFullscreen = async () => { if (!stageRef.current) return; if (document.fullscreenElement) await document.exitFullscreen(); else await stageRef.current.requestFullscreen(); };
  return <div className="space-y-5"><ToolPanel className="flex flex-wrap items-end gap-3"><form onSubmit={load} className="flex min-w-0 flex-1 flex-wrap gap-2"><label className="min-w-60 flex-1"><span className={toolLabelClassName}>website URL</span><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className={toolInputClassName} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} /></label><ToolButton type="submit" className="self-end">load preview</ToolButton></form><ToolButton variant="secondary" className="self-end" onClick={toggleFullscreen}><Expand size={16} />{fullscreen ? "exit fullscreen" : "fullscreen"}</ToolButton></ToolPanel><ToolPanel><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{Object.entries(devices).map(([key, spec]) => { const Icon = spec.icon; return <ToolButton key={key} variant={key === deviceKey ? "primary" : "secondary"} className="shrink-0" onClick={() => setDeviceKey(key)} aria-pressed={key === deviceKey}><Icon size={15} />{spec.label}</ToolButton>; })}</div><div ref={stageRef} className="min-h-[70vh] bg-background p-4 sm:p-8"><div className="flex min-h-[calc(70vh-4rem)] items-center justify-center"><div style={{ aspectRatio: `${device.width} / ${device.height}` }} className="w-full max-w-full overflow-hidden border border-foreground/20 bg-card shadow-[var(--shadow)]"><iframe key={loadedUrl} src={loadedUrl || undefined} title={`${device.label} website preview`} className="h-full w-full border-0 bg-background" sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-top-navigation-by-user-activation" /></div></div></div><p className="mt-4 text-sm text-foreground/60">{device.label} · {device.width} × {device.height}. Some websites prevent embedding in any iframe.</p></ToolPanel></div>;
}
