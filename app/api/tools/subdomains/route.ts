import { NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/tools/network";

type Issuance = { id: string; dns_names: string[]; not_before: string; not_after: string; issuer?: { friendly_name?: string } };

export async function GET(request: Request) {
  try {
    const domain = normalizeDomain(new URL(request.url).searchParams.get("domain") ?? "");
    const endpoint = new URL("https://api.certspotter.com/v1/issuances"); endpoint.searchParams.set("domain", domain); endpoint.searchParams.set("include_subdomains", "true"); endpoint.searchParams.append("expand", "dns_names"); endpoint.searchParams.append("expand", "issuer");
    const response = await fetch(endpoint, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Certificate service returned HTTP ${response.status}.`);
    const results = new Map<string, { name: string; certificates: { id: string; loggedAt: string; notBefore: string; notAfter: string; issuer: string; includesWildcard: boolean }[] }>();
    for (const issuance of await response.json() as Issuance[]) for (const name of issuance.dns_names) {
      const normalized = name.toLowerCase().replace(/\.$/, ""); if (normalized !== domain && !normalized.endsWith(`.${domain}`)) continue;
      const entry = results.get(name) ?? { name, certificates: [] }; entry.certificates.push({ id: issuance.id, loggedAt: issuance.not_before, notBefore: issuance.not_before, notAfter: issuance.not_after, issuer: issuance.issuer?.friendly_name ?? "Unavailable", includesWildcard: name.startsWith("*.") }); results.set(name, entry);
    }
    return NextResponse.json({ domain, subdomains: [...results.values()].sort((first, second) => first.name.localeCompare(second.name)) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to find subdomains." }, { status: 400 }); }
}
