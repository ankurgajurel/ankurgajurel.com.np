import assert from "node:assert/strict";
import test from "node:test";
import { extractMetadata, isPrivateHostname, normalizeDomain, parseInspectableUrl } from "./network";

test("blocks direct private network inspection targets", () => {
  assert.equal(isPrivateHostname("127.0.0.1"), true);
  assert.equal(isPrivateHostname("192.168.1.10"), true);
  assert.equal(isPrivateHostname("example.com"), false);
  assert.throws(() => parseInspectableUrl("http://localhost:3000"));
  assert.equal(parseInspectableUrl("https://example.com/path").hostname, "example.com");
});

test("extracts and resolves page metadata", () => {
  const data = extractMetadata(`<!doctype html><title>Example</title><meta name="description" content="Description"><meta property="og:title" content="Open Graph"><meta property="og:image" content="/card.png"><meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="/canonical">`, "https://example.com/page");
  assert.equal(data.title, "Example");
  assert.equal(data.ogTitle, "Open Graph");
  assert.deepEqual(data.ogImage, ["https://example.com/card.png"]);
  assert.equal(data.canonical, "https://example.com/canonical");
});

test("normalizes a hostname from URL-like user input", () => {
  assert.equal(normalizeDomain("HTTPS://WWW.EXAMPLE.COM./path"), "www.example.com");
  assert.throws(() => normalizeDomain("localhost"));
});
