export type Tool = {
  name: string;
  description: string;
  link: string;
};

export type ToolCategory = {
  name: string;
  tools: Tool[];
};

export const toolCategories: ToolCategory[] = [
  {
    name: "featured",
    tools: [
      { name: "open graph inspector", description: "inspect open graph metadata from any URL", link: "/tools/open-graph" },
      { name: "whois lookup", description: "look up domain information and ownership details", link: "/tools/whois-lookup" },
      { name: "color converter", description: "convert color formats in CSS files", link: "/tools/color-converter" },
      { name: "git diff viewer", description: "preview diffs in your files", link: "/tools/git-diff-viewer" },
    ],
  },
  {
    name: "media tools",
    tools: [
      { name: "image compressor", description: "compress PNG, JPG, and WebP images", link: "/tools/image-compressor" },
      { name: "png to jpg", description: "convert PNG images to JPG format", link: "/tools/png-to-jpg" },
      { name: "video trimmer", description: "trim videos in your browser", link: "/tools/trimmer" },
    ],
  },
  {
    name: "dns tools",
    tools: [
      { name: "whois lookup", description: "look up domain information and ownership details", link: "/tools/whois-lookup" },
      { name: "subdomain finder", description: "find subdomains of a domain", link: "/tools/subdomain-finder" },
      { name: "open graph inspector", description: "inspect open graph metadata from any URL", link: "/tools/open-graph" },
    ],
  },
  {
    name: "utility tools",
    tools: [
      { name: "color converter", description: "convert color formats in CSS files", link: "/tools/color-converter" },
      { name: "signature maker", description: "create signatures without friction", link: "/tools/signature-maker" },
      { name: "world clocks", description: "see the time in different cities", link: "/tools/world-clocks" },
      { name: "git diff viewer", description: "preview diffs in your files", link: "/tools/git-diff-viewer" },
      { name: "test screen responsiveness", description: "test a URL at common screen widths", link: "/tools/test-screens" },
    ],
  },
  {
    name: "finance",
    tools: [
      { name: "nepal tax calculator", description: "calculate income tax in Nepal", link: "/tools/tax-calculator" },
      { name: "forex rates for nepal", description: "see forex rates for Nepal", link: "/tools/forex/np" },
    ],
  },
  {
    name: "easter",
    tools: [
      { name: "mero ui", description: "the small UI kit behind the original tools site", link: "/tools/ui" },
    ],
  },
];
