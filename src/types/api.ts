// API Types

export interface Point {
  long: number;
  lat: number;
  description?: string;
}

export interface RouteRequest {
  startPt: Point;
  endPt: Point;
}

export interface BlockageRequest {
  point: {
    long: number;
    lat: number;
  };
  radius: number;
  name: string;
  description: string;
}

export interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
  [key: string]: any;
}

export interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
  properties: {
    [key: string]: any;
  };
}

export type TravelMode = 'car' | 'bicycle' | 'walking' | 'bus';

export interface TravelModeConfig {
  name: string;
  icon: string;
  roadTypes: string[];
}

