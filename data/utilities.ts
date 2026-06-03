export type Utility = {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
};

export const utilities: Utility[] = [
  {
    id: 0,
    name: "clerk-export",
    description:
      "cli to export clerk users, orgs, memberships, roles, and metadata",
    url: "https://github.com/ankurgajurel/clerk-export",
    language: "TypeScript",
  },
  {
    id: 1,
    name: "s3-preview",
    description: "browse s3 buckets and preview common file types with signed urls",
    url: "https://github.com/ankurgajurel/s3-preview",
    language: "TypeScript",
  },
  {
    id: 2,
    name: "open-graph",
    description: "inspect page metadata and preview social link cards",
    url: "https://tools.ankurgajurel.com.np/tools/open-graph",
    language: "Web",
  },
  {
    id: 3,
    name: "trimmer",
    description: "trim videos in the browser and optionally remove audio",
    url: "https://tools.ankurgajurel.com.np/tools/trimmer",
    language: "Web",
  },
  {
    id: 4,
    name: "image-compressor",
    description: "resize and re-encode images with quality and format controls",
    url: "https://tools.ankurgajurel.com.np/tools/image-compressor",
    language: "Web",
  },
];
