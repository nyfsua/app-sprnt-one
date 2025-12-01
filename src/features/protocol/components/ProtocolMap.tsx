// src/features/protocol/components/ProtocolMap.tsx
import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { Map } from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../lib/mapbox";
import { loadLocalProtocolEvents } from "../lib/events";
import type { ProtocolLayerId } from "../types/events";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN || "";

interface ProtocolMapProps {
  visibleLayers: Record<ProtocolLayerId, boolean>;
}

// if your Tailwind tokens exist you can swap hex for classes elsewhere
const PROTOCOL_COLOR = "#B74735";

const HIDE_POI_PREFIXES = [
  "poi",
  "poi-label",
  "poi-scalerank",
  "airport",
  "airport-label",
  "settlement",
  "settlement-label",
  "place",
  "place-label",
  "neighborhood",
  "road-label",
];

// Mapping for UI tag on popup card
const LAYER_LABELS: Record<string, string> = {
  conflict: "CONFLICT ZONE",
  protests: "CIVIL UNREST",
  shipping: "SHIPPING LANE",
  air: "AIR CORRIDOR",
  infrastructure: "NASCENT INFRASTRUCTURE",
  cultural: "CULTURAL EVENT",
};

// Mapbox image ids + asset URLs
const PROTOCOL_ICON_DEFS = [
  { name: "protocol-conflict", url: "/assets/protocol/icon-conflict.png" },
  { name: "protocol-protests", url: "/assets/protocol/icon-protests.png" },
  { name: "protocol-shipping", url: "/assets/protocol/icon-shipping.png" },
  { name: "protocol-air", url: "/assets/protocol/icon-air.png" },
  { name: "protocol-infrastructure", url: "/assets/protocol/icon-infra.png", },
  { name: "protocol-cultural", url: "/assets/protocol/icon-culture.png" },
];

const ProtocolMap: React.FC<ProtocolMapProps> = ({ visibleLayers }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                               INITIALISE MAP                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    if (!MAPBOX_ACCESS_TOKEN) {
      console.error("[Protocol] Missing Mapbox Access Token");
      return;
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: [10, 10],
      zoom: 1.8,
      projection: "globe",
    });

    mapRef.current = map;

    map.on("style.load", async () => {
      /* ------------------------------- SPACE / FOG ------------------------------ */
      map.setFog({
        color: "rgba(0,0,0,0.9)",
        "high-color": "rgba(0,0,0,0.9)",
        "space-color": "rgba(0,0,0,0)",
        "horizon-blend": 0.0,
        "star-intensity": 0.0,
      });

      /* ------------------------------ LOAD ICONS -------------------------------- */
      await loadProtocolIcons(map);

      /* ---------------------------- LOAD LOCAL EVENTS ---------------------------- */
      const events = await loadLocalProtocolEvents();

      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: events.map((e) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [e.lng, e.lat] },
          properties: {
            id: e.id,
            kind: e.kind,
            protocolLayer: e.protocolLayer,
            title: e.title,
            subtitle: e.subtitle,
            country: e.country,
            ts: e.ts,
          },
        })),
      };

      if (!map.getSource("protocol-events")) {
        map.addSource("protocol-events", {
          type: "geojson",
          data: geojson,
        });
      } else {
        (map.getSource("protocol-events") as mapboxgl.GeoJSONSource).setData(
          geojson
        );
      }

      addOrUpdateProtocolSymbolLayers(map);
      hideBasePointLayers(map);
      attachEventHandlers(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                        TOGGLE LAYER VISIBILITY (SIDEBAR)                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setVis = (id: string, visible: boolean | undefined) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
    };

    setVis("conflict-symbols", visibleLayers.conflict);
    setVis("protests-symbols", visibleLayers.protests);
    setVis("shipping-symbols", visibleLayers.shipping);
    setVis("air-symbols", visibleLayers.air);
    setVis("infrastructure-symbols", visibleLayers.infrastructure);
    setVis("cultural-symbols", visibleLayers.cultural);
  }, [visibleLayers]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default ProtocolMap;

/* -------------------------------------------------------------------------- */
/*                          ICON LOADING (IMAGES)                              */
/* -------------------------------------------------------------------------- */

async function loadProtocolIcons(map: Map) {
  const loadOne = (def: (typeof PROTOCOL_ICON_DEFS)[number]) =>
    new Promise<void>((resolve, reject) => {
      if (map.hasImage(def.name)) return resolve();

      const img = new Image(64, 64);
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          // sdf:true -> we can recolor with icon-color
          map.addImage(def.name, img, { sdf: true });
          resolve();
        } catch (err) {
          console.error("[Protocol] addImage failed", def.name, err);
          resolve();
        }
      };
      img.onerror = (err) => {
        console.error("[Protocol] icon load failed", def.url, err);
        reject(err);
      };
      img.src = def.url;
    });

  await Promise.all(PROTOCOL_ICON_DEFS.map(loadOne));
}

/* -------------------------------------------------------------------------- */
/*                                LAYER HELPERS                               */
/* -------------------------------------------------------------------------- */

function addOrUpdateProtocolSymbolLayers(map: Map) {
  const mkLayer = (
    id: string,
    protocolLayerValue: string,
    iconName: string
  ): mapboxgl.SymbolLayer => ({
    id,
    type: "symbol",
    source: "protocol-events",
    filter: ["==", ["get", "protocolLayer"], protocolLayerValue],
    layout: {
      "icon-image": iconName,
      "icon-size": 0.5, // tweak icon scale here
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    paint: {
      "icon-color": PROTOCOL_COLOR,
      "icon-opacity": 1.0,
    },
  });

  const layers: mapboxgl.SymbolLayer[] = [
    mkLayer("conflict-symbols", "conflict", "protocol-conflict"),
    mkLayer("protests-symbols", "protests", "protocol-protests"),
    mkLayer("shipping-symbols", "shipping", "protocol-shipping"),
    mkLayer("air-symbols", "air", "protocol-air"),
    mkLayer(
      "infrastructure-symbols",
      "infrastructure",
      "protocol-infrastructure"
    ),
    mkLayer("cultural-symbols", "cultural", "protocol-cultural"),
  ];

  layers.forEach((layer) => {
    if (!map.getLayer(layer.id)) {
      map.addLayer(layer);
    } else {
      // update existing layer on style reload
      map.setLayoutProperty(
        layer.id,
        "icon-image",
        layer.layout?.["icon-image"] as any
      );
      map.setPaintProperty(
        layer.id,
        "icon-color",
        layer.paint?.["icon-color"] as any
      );
    }
  });
}

/* -------------------------------------------------------------------------- */

function hideBasePointLayers(map: Map) {
  const style = map.getStyle();
  if (!style || !style.layers) return;

  style.layers.forEach((layer) => {
    const isPointLike = layer.type === "circle" || layer.type === "symbol";
    const shouldHide = HIDE_POI_PREFIXES.some((p) => layer.id.startsWith(p));

    if (isPointLike && shouldHide) {
      try {
        map.setLayoutProperty(layer.id, "visibility", "none");
      } catch {
        // ignore layer we can't touch
      }
    }
  });
}

/* -------------------------------------------------------------------------- */
/*                           INTERACTIONS + POPUP CARD                        */
/* -------------------------------------------------------------------------- */

function attachEventHandlers(map: Map) {
  const layers = [
    "conflict-symbols",
    "protests-symbols",
    "shipping-symbols",
    "air-symbols",
    "infrastructure-symbols",
    "cultural-symbols",
  ];

  // Hover cursor
  layers.forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
  });

  map.on("mouseleave", () => {
    map.getCanvas().style.cursor = "";
  });

  // Click → popup card
  layers.forEach((layerId) => {
    map.on("click", layerId, (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const props: any = feature.properties || {};
      const coords = (feature.geometry as any).coordinates || [];
      const [lng, lat] = coords;

      const layer = props.protocolLayer || "";
      const kind = props.kind || "";
      const country = props.country || "";
      const title = props.title || "";
      const subtitle = props.subtitle || "";
      const layerTag = LAYER_LABELS[layer] || layer.toUpperCase();

      const ts = props.ts ? new Date(props.ts) : null;
      const timestamp = ts
        ? ts.toLocaleString(undefined, {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const html = `
        <div
          style="
            min-width: 230px;
            max-width: 260px;
            background: rgba(5,5,5,0.97);
            border: 1px solid #303032;
            padding: 10px 12px;
            color: #151515;
            font-family: 'OCR A Std', monospace;
            font-size: 11px;
            line-height: 1.35;
            letter-spacing: .02em;
          "
        >
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <div
              style="
                font-family: 'OCR A Std', monospace;
                font-size: 9px;
                text-transform: uppercase;
                color: ${PROTOCOL_COLOR};
                letter-spacing: 0.12em;
              "
            >
              ${layerTag}
            </div>

            <div
              style="
                font-family: 'OCR A Std', monospace;
                font-size: 8px;
                color: #8F8F90;
                padding-top:2px;
              "
            >
              ${timestamp}
            </div>
          </div>

          <div style="font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#C6C6C8; font-size:16px;">
            ${kind} • ${country}
          </div>

          <div style="margin-bottom:3px; color:#C6C6C8; font-weight:200; font-size:10px;">
            ${title}
          </div>

          ${
            subtitle
              ? `<div style="color:#C6C6C8; font-size:10px;">${subtitle}</div>`
              : ""
          }
        </div>
      `;

      new mapboxgl.Popup({
        closeButton: false,
        closeOnMove: true,
        anchor: "bottom",
        offset: [0, -6],
      })
        .setLngLat([lng, lat])
        .setHTML(html)
        .addTo(map);
    });
  });
}
