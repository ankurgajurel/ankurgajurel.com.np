export const ALL_TIMEZONES = Array.from(new Set(["UTC", ...(Intl.supportedValuesOf?.("timeZone") ?? [])])).sort();

export function normalizeTimezone(timezone: string | null | undefined) {
  if (!timezone) return null;
  try { return new Intl.DateTimeFormat("en-US", { timeZone: timezone }).resolvedOptions().timeZone; } catch { return null; }
}

export function isSupportedTimezone(timezone: string | null | undefined): timezone is string { return normalizeTimezone(timezone) !== null; }
export function getCityFromTimezone(timezone: string) { return timezone.split("/").at(-1)?.replace(/_/g, " ") ?? timezone; }

function parts(date: Date, timezone: string) {
  return Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)])) as Record<"year" | "month" | "day" | "hour" | "minute" | "second", number>;
}

export function formatTimeInTimezone(date: Date, timezone: string) {
  const { hour, minute } = parts(date, timezone);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function timezoneOffset(date: Date, timezone: string) {
  const value = parts(date, timezone);
  return Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second) - date.getTime();
}

export function convertTime(time: string, from: string, to: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  const fromZone = normalizeTimezone(from); const toZone = normalizeTimezone(to);
  if (!match || !fromZone || !toZone || fromZone === toZone || Number(match[1]) > 23 || Number(match[2]) > 59) return time;
  const day = parts(new Date(), fromZone); const local = Date.UTC(day.year, day.month - 1, day.day, Number(match[1]), Number(match[2]));
  let timestamp = local;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const next = local - timezoneOffset(new Date(timestamp), fromZone);
    if (next === timestamp) break;
    timestamp = next;
  }
  return formatTimeInTimezone(new Date(timestamp), toZone);
}
