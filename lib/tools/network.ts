import { parse } from "node-html-parser";

export type OpenGraphData = {
  title?: string; description?: string; favicon?: string; canonical?: string; author?: string; robots?: string; viewport?: string; ogTitle?: string; ogDescription?: string; ogImage?: string[]; ogUrl?: string; ogType?: string; ogSiteName?: string; ogLocale?: string; twitterCard?: string; twitterSite?: string; twitterCreator?: string; twitterTitle?: string; twitterDescription?: string; twitterImage?: string[]; metaTags: { name?: string; property?: string; content: string }[];
};

export function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host === "::1" || /^(fc|fd|fe80:)/.test(host) || host.startsWith("::ffff:")) return true;
  const octets = host.split(".").map(Number);
  if (octets.length !== 4 || octets.some((item) => !Number.isInteger(item))) return false;
  const [first, second] = octets;
  return first === 0 || first === 10 || first === 127 || (first === 100 && second >= 64 && second <= 127) || (first === 169 && second === 254) || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168) || (first === 198 && (second === 18 || second === 19));
}

export function parseInspectableUrl(value: string) {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error("Enter a valid URL."); }
  if (!/^https?:$/.test(url.protocol)) throw new Error("Only HTTP and HTTPS URLs can be inspected.");
  if (isPrivateHostname(url.hostname)) throw new Error("Local and private network addresses cannot be inspected.");
  return url;
}

function resolveUrl(base: string, value: string) { try { return new URL(value, base).href; } catch { return value; } }

export function extractMetadata(html: string, sourceUrl: string): OpenGraphData {
  const document = parse(html);
  const data: OpenGraphData = { title: document.querySelector("title")?.text.trim() || undefined, metaTags: [] };
  const description = document.querySelector('meta[name="description"]')?.getAttribute("content");
  if (description) data.description = description;
  const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute("href");
  if (favicon) data.favicon = resolveUrl(sourceUrl, favicon);
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
  if (canonical) data.canonical = resolveUrl(sourceUrl, canonical);
  document.querySelectorAll("meta").forEach((tag) => {
    const name = tag.getAttribute("name") || undefined; const property = tag.getAttribute("property") || undefined; const content = tag.getAttribute("content");
    if (!content) return;
    data.metaTags.push({ name, property, content });
    if (property?.startsWith("og:")) {
      const key = property.slice(3);
      if (key === "image") (data.ogImage ??= []).push(resolveUrl(sourceUrl, content));
      else (data as Record<string, unknown>)[`og${key[0].toUpperCase()}${key.slice(1)}`] = key === "url" ? resolveUrl(sourceUrl, content) : content;
    }
    const twitter = property?.startsWith("twitter:") ? property.slice(8) : name?.startsWith("twitter:") ? name.slice(8) : undefined;
    if (twitter) {
      if (twitter === "image") (data.twitterImage ??= []).push(resolveUrl(sourceUrl, content));
      else (data as Record<string, unknown>)[`twitter${twitter[0].toUpperCase()}${twitter.slice(1)}`] = content;
    }
    if (name === "author") data.author = content;
    if (name === "robots") data.robots = content;
    if (name === "viewport") data.viewport = content;
  });
  return data;
}

export function normalizeDomain(value: string) {
  let hostname: string;
  try { hostname = new URL(value.includes("://") ? value : `https://${value.trim()}`).hostname.toLowerCase().replace(/\.$/, ""); } catch { throw new Error("Enter a valid domain name."); }
  if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,62}$/i.test(hostname)) throw new Error("Enter a valid domain name.");
  return hostname;
}
