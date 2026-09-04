import { NextRequest, NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/tools/network";

const store = new Map<string, { count: number; startedAt: number }>();
const limit = 10; const windowMs = 60 * 60 * 1000;
function checkRateLimit(request: NextRequest) { const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? request.headers.get("x-real-ip") ?? "unknown"; const now = Date.now(); const current = store.get(ip); const entry = !current || now - current.startedAt > windowMs ? { count: 0, startedAt: now } : current; if (entry.count >= limit) return { allowed: false, remaining: 0, resetIn: Math.ceil((windowMs - (now - entry.startedAt)) / 60_000) }; entry.count += 1; store.set(ip, entry); return { allowed: true, remaining: limit - entry.count, resetIn: Math.ceil((windowMs - (now - entry.startedAt)) / 60_000) }; }
type VCardField = [string, Record<string, unknown>, string, string];
type VCard = [string, VCardField[]];
function vcard(entity: Record<string, unknown>) { const card = entity.vcardArray as VCard | undefined; return Object.fromEntries((card?.[1] ?? []).filter((item) => ["fn", "email", "tel"].includes(item[0])).map((item) => [item[0], item[3]])); }

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request); if (!rate.allowed) return NextResponse.json({ error: `Rate limit exceeded. Try again in ${rate.resetIn} minutes.`, ...rate }, { status: 429 });
  try {
    const domain = normalizeDomain(request.nextUrl.searchParams.get("domain") ?? ""); const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { headers: { Accept: "application/rdap+json, application/json" }, next: { revalidate: 2_592_000 }, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(response.status === 404 ? "This domain was not found." : `WHOIS service returned HTTP ${response.status}.`);
    const data = await response.json() as Record<string, unknown>; const entities = (data.entities as Record<string, unknown>[] ?? []); const role = (name: string) => entities.find((entity) => (entity.roles as string[] | undefined)?.includes(name));
    return NextResponse.json({ domain, remaining: rate.remaining, resetIn: rate.resetIn, sections: { domain: { handle: data.handle, status: (data.status as string[] | undefined)?.join(", "), registrationDate: (data.events as { eventAction: string; eventDate: string }[] | undefined)?.find((event) => event.eventAction === "registration")?.eventDate, expirationDate: (data.events as { eventAction: string; eventDate: string }[] | undefined)?.find((event) => event.eventAction === "expiration")?.eventDate }, registrar: vcard(role("registrar") ?? {}), registrant: vcard(role("registrant") ?? {}), nameservers: (data.nameservers as { ldhName?: string }[] | undefined)?.map((item) => item.ldhName).filter(Boolean) } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "WHOIS lookup failed.", remaining: rate.remaining, resetIn: rate.resetIn }, { status: 400 }); }
}
