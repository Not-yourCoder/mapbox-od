/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { geojson } from "./geoJson";
import { pulsingDot } from "../ui/pulsingDot/pulsingDot";

import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "mapbox-gl-style-switcher/styles.css";

export const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [is3D, setIs3D] = useState(false);
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoibXJwaG90b24iLCJhIjoiY2x5b2k2dmYzMGRjaTJvcGxtZW1zcjhxMSJ9.S9dL6ZYqB1u8RUEbTGQ1IQ";

    if (!mapContainerRef.current) return;
    const start = {
      center: [0, 0] as [number, number],
      zoom: 2,
      pitch: 0,
      bearing: 0,
    };

    const end = {
      center: [84, 20] as [number, number],
      zoom: 6.5,
      bearing: 0,
      pitch: 0,
    };
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      ...start
    });
    mapRef.current = map

    // Controls
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl as any,
        countries: "IN",
      })
    );

    // map.addControl(new MapboxStyleSwitcherControl());

    map.on("load", () => {
      map.flyTo({
        ...end,
        duration: 12000,
        essential: true,
      });
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      map.addSource('dot-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [85.8179, 19.8049]
              },
              properties: null
            }
          ]
        }
      });

      map.addSource("places", {
        type: "geojson",
        data: geojson
      });

      map.addLayer({
        id: 'layer-with-pulsing-dot',
        type: 'symbol',
        source: 'dot-point',
        layout: {
          'icon-image': 'pulsing-dot'
        }
      });

      map.addLayer({
        id: 'places',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-color': 'red',
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });



      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mouseenter', 'places', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.message; // Change description to message

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    return () => map.remove();
  }, [is3D]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggle3DLayer = (enable: boolean) => {
    const map = mapRef.current;
    if (!map) return;

    // Layers
    const layers = map.getStyle()?.layers;
    const labelLayerId = layers?.find(
      (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
    )?.id;

    if (enable) {
      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    } else {
      if (map.getLayer('add-3d-buildings')) {
        map.removeLayer('add-3d-buildings');
      }
    }
  };

  const handleToggle3D = () => {
    setIs3D((prev) => !prev);
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div ref={mapContainerRef} style={{ height: "100%" }} />
      <button
        onClick={handleToggle3D}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          padding: "10px",
          background: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Toggle <span style={{ color: is3D ? "green" : "red" }}>3D</span>
      </button>
    </div>
  );
};
