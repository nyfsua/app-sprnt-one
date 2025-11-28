// src/features/protocol/components/ProtocolMap.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../lib/mapbox";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN || "";

const ProtocolMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error("[Protocol] Missing Mapbox access token");
      return;
    }
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: [10, 10],
      zoom: 1.8,
      projection: "globe",
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Make the "space" outside the globe transparent so the BG image shows
      map.setFog({
        color: "rgba(0,0,0,0.9)",      // atmosphere tint over the globe
        "high-color": "rgba(0,0,0,0.9)",
        "space-color": "rgba(0,0,0,0)", // fully transparent space
        "horizon-blend": 0.0,
        "star-intensity": 0.0,
      });

      // Make the map background slightly transparent so the space image leaks through
      const style = map.getStyle();
      const bgLayer = style.layers?.find((l) => l.type === "background");
      if (bgLayer) {
        try {
          map.setPaintProperty(
            bgLayer.id,
            "background-color",
            "rgba(0,0,0,0.9)"
          );
        } catch {
          // ignore if style doesn't support it
        }
      }
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        
        backgroundImage: "url(/assets/protocol-space-bg.png)",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Mapbox canvas sits on top, with transparent space */}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

export default ProtocolMap;
