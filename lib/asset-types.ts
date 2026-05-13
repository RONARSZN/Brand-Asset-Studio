export const ASSET_TYPES = [
  "Characters",
  "Textures",
  "Backgrounds",
  "Logos",
  "Misc",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

export function isAssetType(value: string): value is AssetType {
  return ASSET_TYPES.includes(value as AssetType);
}
