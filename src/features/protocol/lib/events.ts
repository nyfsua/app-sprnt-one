// src/features/protocol/lib/events.ts
import type { ProtocolEvent } from "../types/events";

// This is what ProtocolMap calls.
// Later you can swap this out for a real API call.
export async function loadLocalProtocolEvents(): Promise<ProtocolEvent[]> {
  return [
    ...MOCK_CONFLICTS,
    ...MOCK_PROTESTS,
    ...MOCK_SHIPS,
    ...MOCK_AIR,
    ...MOCK_INFRA,
    ...MOCK_CULTURE,
  ];
}

// -----------------------------------------------------------------------------
// MOCK DATA (replace with ACLED / OpenSky / MarineTraffic later)
// -----------------------------------------------------------------------------

const MOCK_CONFLICTS: ProtocolEvent[] = [
  {
    id: "conflict_001",
    protocolLayer: "conflict",
    kind: "CONFLICT",
    lat: 9.0765,
    lng: 7.3986,
    ts: "2024-11-20T12:30:00Z",
    title: "Armed clash",
    subtitle: "Battles",
    country: "Nigeria",
  },
  {
    id: "conflict_002",
    protocolLayer: "conflict",
    kind: "CONFLICT",
    lat: 6.5244,
    lng: 3.3792,
    ts: "2024-11-19T15:00:00Z",
    title: "Protest with intervention",
    subtitle: "Urban disturbance",
    country: "Nigeria",
  },
];

const MOCK_PROTESTS: ProtocolEvent[] = [
  {
    id: "protest_001",
    protocolLayer: "protests",
    kind: "PROTEST",
    lat: 5.6037,
    lng: -0.187,
    ts: "2024-11-18T08:00:00Z",
    title: "Port workers strike",
    subtitle: "Civil unrest",
    country: "Ghana",
  },
];

const MOCK_SHIPS: ProtocolEvent[] = [
  {
    id: "ship_001",
    protocolLayer: "shipping",
    kind: "VESSEL",
    lat: 4.5,
    lng: 7.0,
    ts: "2024-11-20T11:55:00Z",
    title: "MAERSK LAGOS",
    subtitle: "Container vessel",
    country: "Liberia",
  },
  {
    id: "ship_002",
    protocolLayer: "shipping",
    kind: "VESSEL",
    lat: 6.0,
    lng: 2.4,
    ts: "2024-11-20T12:05:00Z",
    title: "MSC ATLANTIC",
    subtitle: "Container vessel",
    country: "Panama",
  },
];

const MOCK_AIR: ProtocolEvent[] = [
  {
    id: "air_001",
    protocolLayer: "air",
    kind: "AIRCRAFT",
    lat: 8.9915,
    lng: 7.3943,
    ts: "2024-11-20T12:35:00Z",
    title: "KQ101",
    subtitle: "Live flight",
    country: "Kenya",
  },
  {
    id: "air_002",
    protocolLayer: "air",
    kind: "AIRCRAFT",
    lat: 14.5994,
    lng: -17.451,
    ts: "2024-11-20T12:36:00Z",
    title: "BA74",
    subtitle: "Live flight",
    country: "UK",
  },
];

const MOCK_INFRA: ProtocolEvent[] = [
  {
    id: "infra_001",
    protocolLayer: "infrastructure",
    kind: "INFRA",
    lat: 9.0579,
    lng: 7.4951,
    ts: "2024-11-10T10:00:00Z",
    title: "New power substation",
    subtitle: "Under construction",
    country: "Nigeria",
  },
];

const MOCK_CULTURE: ProtocolEvent[] = [
  {
    id: "culture_001",
    protocolLayer: "cultural",
    kind: "CULTURE",
    lat: 6.4654,
    lng: 3.4064,
    ts: "2024-11-21T18:00:00Z",
    title: "Art festival",
    subtitle: "Cultural event",
    country: "Nigeria",
  },
];
