import { menuItems } from "@/data/menuItems.data";


// Utility: get default images from featured menu items (falls back to any if needed)
export default function getDefaultImages(nb: number): string[] {
  const featured = menuItems
    .filter(m => m.featured && !!m.image)
    .map(m => m.image!) as string[];
  const pool = (featured.length >= nb
    ? featured
    : (menuItems
        .map(m => m.image)
        .filter((s): s is string => typeof s === 'string' && s.length > 0))) as string[];
  // Pick up to 6 unique images
  const unique = Array.from(new Set<string>(pool));
  return unique.slice(0, nb);
}

