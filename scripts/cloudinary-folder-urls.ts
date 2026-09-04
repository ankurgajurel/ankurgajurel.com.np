// run with npx tsx scripts/cloudinary-folder-urls.ts
// requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in env

import * as https from "https";
import * as path from "path";
import * as readline from "readline";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env.local"), quiet: true });
dotenv.config({ path: path.join(process.cwd(), ".env"), quiet: true });

type ResourceType = "image" | "video";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  resource_type: ResourceType;
}

interface CloudinaryResourcesSearchResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
}

type FolderMode = "dynamic" | "fixed";

interface GalleryItem {
  id: number;
  type: ResourceType;
  src: string;
  caption: string;
}

interface CliOptions {
  folder?: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if ((arg === "--folder" || arg === "-f") && next) {
      options.folder = next;
      i++;
    }
  }

  return options;
}

function adminApiGet(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  endpointPath: string,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const req = https.request(
      {
        hostname: "api.cloudinary.com",
        path: endpointPath,
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (
            !res.statusCode ||
            res.statusCode < 200 ||
            res.statusCode >= 300
          ) {
            return reject(
              new Error(`Cloudinary API error (${res.statusCode}): ${data}`),
            );
          }

          try {
            const parsed = JSON.parse(data) as Record<string, unknown>;
            resolve(parsed);
          } catch {
            reject(new Error("Failed to parse Cloudinary API response"));
          }
        });
      },
    );

    req.on("error", reject);
    req.end();
  });
}

async function folderExists(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  folder: string,
): Promise<boolean> {
  const query = new URLSearchParams({
    expression: `path="${folder}"`,
    max_results: "1",
  });
  const endpointPath = `/v1_1/${encodeURIComponent(cloudName)}/folders/search?${query.toString()}`;
  const response = await adminApiGet(
    cloudName,
    apiKey,
    apiSecret,
    endpointPath,
  );
  const folders = response.folders as unknown[] | undefined;
  return Array.isArray(folders) && folders.length > 0;
}

async function getFolderMode(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
): Promise<FolderMode | undefined> {
  const endpointPath = `/v1_1/${encodeURIComponent(cloudName)}/config?settings=true`;
  const response = await adminApiGet(
    cloudName,
    apiKey,
    apiSecret,
    endpointPath,
  );
  const settings = response.settings as { folder_mode?: string } | undefined;
  const mode = settings?.folder_mode;
  if (mode === "dynamic" || mode === "fixed") {
    return mode;
  }
  return undefined;
}

function escapeSearchString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildFolderExpression(
  folder: string,
  resourceType: ResourceType,
  folderMode?: FolderMode,
): string {
  const escapedFolder = escapeSearchString(folder);
  const prefix = `${escapedFolder}/*`;

  if (folderMode === "fixed") {
    return `resource_type:${resourceType} AND (folder="${escapedFolder}" OR folder:"${prefix}")`;
  }

  return `resource_type:${resourceType} AND (asset_folder="${escapedFolder}" OR asset_folder:"${prefix}")`;
}

async function getAllResourceUrls(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  folder: string,
  resourceType: ResourceType,
  folderMode?: FolderMode,
): Promise<CloudinaryResource[]> {
  let nextCursor: string | undefined;
  const resources: CloudinaryResource[] = [];

  do {
    const query = new URLSearchParams({
      expression: buildFolderExpression(folder, resourceType, folderMode),
      max_results: "500",
    });
    if (nextCursor) {
      query.set("next_cursor", nextCursor);
    }

    const endpointPath = `/v1_1/${encodeURIComponent(cloudName)}/resources/search?${query.toString()}`;
    const rawPage = await adminApiGet(
      cloudName,
      apiKey,
      apiSecret,
      endpointPath,
    );
    const page = rawPage as unknown as CloudinaryResourcesSearchResponse;

    for (const resource of page.resources ?? []) {
      if (resource.secure_url) {
        resources.push(resource);
      }
    }

    nextCursor = page.next_cursor;
  } while (nextCursor);

  return resources;
}

function toCaption(publicId: string): string {
  const lastSegment = publicId.split("/").pop() ?? publicId;
  const normalized = lastSegment.replace(/[_-]+/g, " ").trim();
  if (!normalized) {
    return "Untitled";
  }

  return normalized
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function formatAsTsArray(items: GalleryItem[]): string {
  const lines: string[] = ["["];

  for (const item of items) {
    lines.push("  {");
    lines.push(`    id: ${item.id},`);
    lines.push(`    type: "${item.type}",`);
    lines.push(`    src: "${item.src}",`);
    lines.push(`    caption: "${item.caption}",`);
    lines.push("  },");
  }

  lines.push("]");
  return lines.join("\n");
}

async function main() {
  const opts = parseArgs();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = opts.folder || (await question("Folder path: "));

  if (!cloudName || !apiKey || !apiSecret || !folder) {
    throw new Error(
      "Missing required values. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and provide a folder.",
    );
  }

  const exists = await folderExists(cloudName, apiKey, apiSecret, folder);
  if (!exists) {
    console.warn(
      `Warning: folder "${folder}" was not found by /folders/search. Continuing with asset search.`,
    );
  }

  const folderMode = await getFolderMode(cloudName, apiKey, apiSecret);
  if (folderMode) {
    console.log(`Detected Cloudinary folder mode: ${folderMode}`);
  } else {
    console.log(
      "Could not detect folder mode. Assuming dynamic mode search fields.",
    );
  }

  console.log(`\nFetching resources from folder "${folder}"...`);

  const [imageResources, videoResources] = await Promise.all([
    getAllResourceUrls(
      cloudName,
      apiKey,
      apiSecret,
      folder,
      "image",
      folderMode,
    ),
    getAllResourceUrls(
      cloudName,
      apiKey,
      apiSecret,
      folder,
      "video",
      folderMode,
    ),
  ]);

  console.log(
    `\nFound ${imageResources.length} images and ${videoResources.length} videos.`,
  );

  const allResources = [...imageResources, ...videoResources].sort((a, b) =>
    a.public_id.localeCompare(b.public_id),
  );

  if (allResources.length === 0) {
    console.log("\nNo resources found for the given folder.");
    return;
  }

  const galleryItems: GalleryItem[] = allResources.map((resource, index) => ({
    id: index + 1,
    type: resource.resource_type,
    src: resource.secure_url,
    caption: toCaption(resource.public_id),
  }));

  console.log("\nGallery items:");
  console.log(formatAsTsArray(galleryItems));
}

main()
  .catch((err) => {
    console.error("Error:", (err as Error).message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
