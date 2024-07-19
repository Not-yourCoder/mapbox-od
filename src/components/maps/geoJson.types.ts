// Define the interface for the coordinates
export type Coordinates = [number, number];

// Define the interface for the geometry of each feature
export interface Geometry {
  type: "Point"; // The type can be extended if needed (e.g., "Polygon", "LineString")
  coordinates: Coordinates;
}

// Define the interface for the properties of each feature
export interface Properties {
  message: string;
  imageId?: number;
  iconSize?: [number, number];
  description?: string;
}

// Define the interface for each feature in the FeatureCollection
export interface Feature {
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

// Define the interface for the FeatureCollection
export interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}
