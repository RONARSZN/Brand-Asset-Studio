import { randomUUID } from "crypto";
import sharp from "sharp";
import type { AssetType } from "@/lib/asset-types";

const NATIVE_TYPES = new Set(["jpg", "jpeg", "png", "webp"]);
const ACCEPTED_TYPES = new Set([
  "ai",
  "eps",
  "jpeg",
  "jpg",
  "pdf",
  "png",
  "psd",
  "svg",
  "tiff",
  "tif",
  "webp",
]);

export type PreparedAssetFile = {
  body: Buffer;
  contentType: string;
  path: string;
};

export async function prepareAssetFile(
  file: File,
  brandId: string,
  assetType: AssetType,
): Promise<PreparedAssetFile> {
  const extension = getExtension(file.name);

  if (!extension || !ACCEPTED_TYPES.has(extension)) {
    throw new Error("Unsupported file type.");
  }

  const source = Buffer.from(await file.arrayBuffer());
  const converted = await convertFile(source, extension);
  const storedExtension = NATIVE_TYPES.has(extension) ? extension : "png";
  const contentType = getContentType(storedExtension);

  return {
    body: converted,
    contentType,
    path: getStoragePath(file.name, brandId, assetType, storedExtension),
  };
}

function getExtension(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension === "tif" ? "tiff" : extension;
}

async function convertFile(source: Buffer, extension: string) {
  if (NATIVE_TYPES.has(extension)) {
    return source;
  }

  try {
    return await sharp(source, { pages: 1 }).png().toBuffer();
  } catch {
    throw new Error("This file could not be converted to PNG.");
  }
}

function getContentType(extension: string) {
  if (extension === "jpg" || extension === "jpeg") {
    return "image/jpeg";
  }

  return `image/${extension}`;
}

function getStoragePath(
  filename: string,
  brandId: string,
  assetType: AssetType,
  extension: string,
) {
  const safeName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${brandId}/${assetType.toLowerCase()}/${Date.now()}-${randomUUID()}-${safeName}.${extension}`;
}
