// src/features/protocol/types/events.ts

export type ProtocolLayerId =
  | "conflict"
  | "protests"
  | "shipping"
  | "air"
  | "infrastructure"
  | "cultural";

export type EventKind =
  | "CONFLICT"
  | "PROTEST"
  | "VESSEL"
  | "AIRCRAFT"
  | "INFRA"
  | "CULTURE";

export interface ProtocolEvent {
  id: string;
  protocolLayer: ProtocolLayerId; // key used by the map filters
  kind: EventKind;
  lat: number;
  lng: number;
  ts: string; // ISO timestamp
  title: string;
  subtitle?: string;
  country?: string;
  meta?: Record<string, any>;
}
