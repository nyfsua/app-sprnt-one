// src/features/protocol/lib/mapbox.ts
export const MAPBOX_ACCESS_TOKEN =
  (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string) || "";

export const MAPBOX_STYLE =
  (import.meta.env.VITE_MAPBOX_STYLE as string) ||
  "mapbox://styles/mapbox/dark-v11";

if (!MAPBOX_ACCESS_TOKEN) {
  console.warn("[Protocol] Missing VITE_MAPBOX_ACCESS_TOKEN");
}
