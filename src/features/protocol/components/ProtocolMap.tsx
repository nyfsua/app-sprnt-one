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

      addOrUpdateProtocolLayers(map);
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

    setVis("conflict-points", visibleLayers.conflict);
    setVis("protests-points", visibleLayers.protests);
    setVis("shipping-points", visibleLayers.shipping);
    setVis("air-points", visibleLayers.air);
    setVis("infrastructure-points", visibleLayers.infrastructure);
    setVis("cultural-points", visibleLayers.cultural);
  }, [visibleLayers]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default ProtocolMap;

/* -------------------------------------------------------------------------- */
/*                                LAYER HELPERS                                */
/* -------------------------------------------------------------------------- */

function addOrUpdateProtocolLayers(map: Map) {
  const mkLayer = (id: string, protocolLayerValue: string) => ({
    id,
    type: "circle" as const,
    source: "protocol-events",
    filter: ["==", ["get", "protocolLayer"], protocolLayerValue],
    paint: {
      "circle-radius": 6,
      "circle-color": PROTOCOL_COLOR,
      "circle-stroke-color": "#E2E1DF",
      "circle-stroke-width": 0.6,
      "circle-opacity": 1.0,
    },
  });

  const layers = [
    mkLayer("conflict-points", "conflict"),
    mkLayer("protests-points", "protests"),
    mkLayer("shipping-points", "shipping"),
    mkLayer("air-points", "air"),
    mkLayer("infrastructure-points", "infrastructure"),
    mkLayer("cultural-points", "cultural"),
  ];

  layers.forEach((layer) => {
    if (!map.getLayer(layer.id)) {
      map.addLayer(layer as any);
    } else {
      map.setPaintProperty(layer.id, "circle-color", PROTOCOL_COLOR);
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
      } catch {}
    }
  });
}

/* -------------------------------------------------------------------------- */
/*                           INTERACTIONS + POPUP CARD                          */
/* -------------------------------------------------------------------------- */

function attachEventHandlers(map: Map) {
  const layers = [
    "conflict-points",
    "protests-points",
    "shipping-points",
    "air-points",
    "infrastructure-points",
    "cultural-points",
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

          <!-- TAG + TIMESTAMP -->
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <div
              style="
                font-family: 'OCR A Std', monospace;
                font-size: 9px;
                text-transform: uppercase;
                
                color: #B74735;
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

          <!-- KIND + COUNTRY -->
          <div style="font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#C6C6C8; font-size:16px;">
            ${kind} • ${country}
          </div>

          <!-- TITLE -->
          <div style="margin-bottom:3px; color:#C6C6C8; font-weight:200; font-size:10px;">
            ${title}
          </div>

          ${
            subtitle
              ? `<div style="color:#C6C6C8 font-size:10px;">${subtitle}</div>`
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
