import { NextResponse } from "next/server";
import { extractMetadata, parseInspectableUrl } from "@/lib/tools/network";

const headers = { "User-Agent": "Mozilla/5.0 (compatible; AnkurToolsMetadata/1.0)", Accept: "text/html,application/xhtml+xml" };

async function fetchInspectableUrl(start: URL) {
  let current = start;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(current, { headers, redirect: "manual", signal: AbortSignal.timeout(10_000) });
    if (response.status < 300 || response.status >= 400) return { response, url: current };
    const location = response.headers.get("location");
    if (!location) return { response, url: current };
    current = parseInspectableUrl(new URL(location, current).href);
  }
  throw new Error("Too many redirects while fetching the URL.");
}

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get("url");
  if (!value) return NextResponse.json({ error: "URL parameter is required." }, { status: 400 });
  let inspectableUrl: URL;
  try {
    inspectableUrl = parseInspectableUrl(value);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enter a valid URL." },
      { status: 400 }
    );
  }
  try {
    const { response, url } = await fetchInspectableUrl(inspectableUrl);
    if (!response.ok) return NextResponse.json({ error: `The remote site returned HTTP ${response.status}.` }, { status: 502 });
    if (!response.headers.get("content-type")?.includes("text/html")) return NextResponse.json({ error: "The remote response is not HTML." }, { status: 415 });
    const body = await response.text();
    if (body.length > 2_000_000) return NextResponse.json({ error: "The remote HTML response is too large to inspect." }, { status: 413 });
    return NextResponse.json({ data: extractMetadata(body, url.href), inspectedUrl: url.href });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to inspect that URL." }, { status: 500 });
  }
}
