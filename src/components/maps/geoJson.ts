import { FeatureCollection } from "./geoJson.types";

export const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        message: "Jagannath Temple",
        description:"Mandir h ek"
      },
      geometry: {
        type: "Point",
        coordinates: [85.8179, 19.8049],
      },
    }
  ],
};

