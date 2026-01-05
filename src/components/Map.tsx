import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON as GeoJSONLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { GeoJSON, Point } from '../types/api';

// Fix for default marker icons in React-Leaflet - using CDN URLs
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface MapProps {
  center: [number, number];
  zoom: number;
  routeGeoJSON?: GeoJSON | null;
  roadTypeGeoJSON?: GeoJSON | null;
  blockagesGeoJSON?: GeoJSON | null;
  startPoint?: Point | null;
  endPoint?: Point | null;
  onMapClick?: (lat: number, lng: number) => void;
}

// Component to update map bounds when GeoJSON changes
function MapUpdater({ geoJSON }: { geoJSON?: GeoJSON | null }) {
  const map = useMap();
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  useEffect(() => {
    if (geoJSON && geoJSON.features) {
      const bounds = new L.LatLngBounds([]);
      let hasBounds = false;

      geoJSON.features.forEach((feature) => {
        if (feature.geometry.type === 'LineString') {
          const coordinates = feature.geometry.coordinates as number[][];
          coordinates.forEach((coord) => {
            bounds.extend([coord[1], coord[0]]);
            hasBounds = true;
          });
        } else if (feature.geometry.type === 'Point') {
          const coord = feature.geometry.coordinates as unknown as number[];
          bounds.extend([coord[1], coord[0]]);
          hasBounds = true;
        } else if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates as number[][][];
          coordinates[0].forEach((coord) => {
            bounds.extend([coord[1], coord[0]]);
            hasBounds = true;
          });
        }
      });

      if (hasBounds && (!boundsRef.current || !boundsRef.current.equals(bounds))) {
        boundsRef.current = bounds;
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [geoJSON, map]);

  return null;
}

// Component to handle map clicks
function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);

  return null;
}

const Map: React.FC<MapProps> = ({
  center,
  zoom,
  routeGeoJSON,
  roadTypeGeoJSON,
  blockagesGeoJSON,
  startPoint,
  endPoint,
  onMapClick,
}) => {

  // Style functions for GeoJSON layers
  const routeStyle = {
    color: '#00ff00', // Bright green color
    weight: 5,
    opacity: 0.8,
  };

  // Road type styling for GeoJSON layer
  const roadTypeStyle = {
    color: '#0066ff',  // Bright blue
    weight: 4,         // Thicker lines for better visibility
    opacity: 0.9,      // Higher opacity for better visibility
  };

  const blockageStyle = () => {
    return {
      color: '#ff0000',        // Red border
      weight: 2,               // Border width
      opacity: 0.9,            // Border opacity
      fillColor: '#ff0000',    // Red fill
      fillOpacity: 0.35,       // Slightly transparent fill (35% opacity)
    };
  };

  // Filter route GeoJSON to exclude Point features (keep LineString, MultiLineString, etc.)
  const processRouteGeoJSON = (geoJSON: GeoJSON | null): GeoJSON | null => {
    if (!geoJSON || !geoJSON.features) return geoJSON;

    try {
      const filteredFeatures = geoJSON.features.filter((feature) => {
        // Keep all line geometry types, exclude Point features
        return feature.geometry.type !== 'Point';
      });

      return {
        ...geoJSON,
        features: filteredFeatures,
      };
    } catch (error) {
      console.error('Error processing route GeoJSON:', error);
      return geoJSON;
    }
  };

  // Convert Point blockages to circles if needed
  const processBlockageGeoJSON = (geoJSON: GeoJSON | null): GeoJSON | null => {
    if (!geoJSON || !geoJSON.features) return geoJSON;

    try {
      const processedFeatures = geoJSON.features.map((feature) => {
        try {
          // If it's already a Polygon, return as is
          if (feature.geometry.type === 'Polygon') {
            return feature;
          }

          // If it's a Point, convert to a circle (Polygon)
          if (feature.geometry.type === 'Point') {
            const coords = feature.geometry.coordinates as unknown as number[];
            if (!coords || coords.length < 2 || !isFinite(coords[0]) || !isFinite(coords[1])) {
              console.warn('Invalid coordinates in blockage feature:', feature);
              return feature; // Return original if invalid
            }

            const radius = feature.properties?.["distance (meters)"] ?? 200; // meters
            if (!isFinite(radius) || radius <= 0) {
              console.warn('Invalid radius in blockage feature:', feature);
              return feature; // Return original if invalid
            }

            const lat = coords[1];
            const lng = coords[0];

            // Validate coordinates
            if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
              console.warn('Invalid lat/lng values:', lat, lng);
              return feature;
            }

            // Create a circle polygon using approximate conversion
            // 1 degree latitude ≈ 111,000 meters
            // 1 degree longitude ≈ 111,000 * cos(latitude) meters
            const latRadius = radius / 111000;
            const cosLat = Math.cos(lat * Math.PI / 180);
            // Avoid division by zero
            if (Math.abs(cosLat) < 0.0001) {
              console.warn('Latitude too close to pole:', lat);
              return feature;
            }
            const lngRadius = radius / (111000 * cosLat);

            // Create a circle with 64 points
            const circlePoints: number[][] = [];
            for (let i = 0; i < 64; i++) {
              const angle = (i / 64) * 2 * Math.PI;
              const pointLng = lng + lngRadius * Math.cos(angle);
              const pointLat = lat + latRadius * Math.sin(angle);
              circlePoints.push([pointLng, pointLat]);
            }
            // Close the circle
            circlePoints.push(circlePoints[0]);

            return {
              ...feature,
              geometry: {
                type: 'Polygon',
                coordinates: [circlePoints],
              },
            };
          }

          return feature;
        } catch (error) {
          console.error('Error processing blockage feature:', error, feature);
          return feature; // Return original feature on error
        }
      });

      return {
        ...geoJSON,
        features: processedFeatures,
      };
    } catch (error) {
      console.error('Error processing blockage GeoJSON:', error);
      return geoJSON; // Return original on error
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {routeGeoJSON && (() => {
        try {
          const processedRoute = processRouteGeoJSON(routeGeoJSON);
          if (!processedRoute || !processedRoute.features || processedRoute.features.length === 0) {
            return null;
          }
          return (
            <GeoJSONLayer
              data={processedRoute as any}
              style={routeStyle}
              key={`route-${JSON.stringify(routeGeoJSON).slice(0, 100)}`}
            />
          );
        } catch (error) {
          console.error('Error rendering route:', error);
          return null;
        }
      })()}

      {roadTypeGeoJSON && (
        <GeoJSONLayer
          data={roadTypeGeoJSON as any}
          style={roadTypeStyle}
          key={`roadtype-${JSON.stringify(roadTypeGeoJSON).slice(0, 100)}`}
        />
      )}

      {blockagesGeoJSON && (() => {
        try {
          const processedBlockages = processBlockageGeoJSON(blockagesGeoJSON);
          if (!processedBlockages || !processedBlockages.features || processedBlockages.features.length === 0) {
            return null;
          }
          return (
            <GeoJSONLayer
              data={processedBlockages as any}
              style={blockageStyle}
              key={`blockages-${JSON.stringify(blockagesGeoJSON).slice(0, 100)}`}
            />
          );
        } catch (error) {
          console.error('Error rendering blockages:', error);
          return null;
        }
      })()}

      {startPoint && (
        <Marker 
          position={[startPoint.lat, startPoint.long]}
          icon={L.divIcon({
            className: 'custom-marker-start',
            html: `<div style="background-color: #28a745; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [25, 25],
            iconAnchor: [12.5, 25],
          })}
        >
          <Popup>
            <strong>Start Point</strong>
            <br />
            {startPoint.description || `${startPoint.lat}, ${startPoint.long}`}
          </Popup>
        </Marker>
      )}

      {endPoint && (
        <Marker 
          position={[endPoint.lat, endPoint.long]}
          icon={L.divIcon({
            className: 'custom-marker-end',
            html: `<div style="background-color: #dc3545; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [25, 25],
            iconAnchor: [12.5, 25],
          })}
        >
          <Popup>
            <strong>End Point</strong>
            <br />
            {endPoint.description || `${endPoint.lat}, ${endPoint.long}`}
          </Popup>
        </Marker>
      )}

      <MapUpdater geoJSON={routeGeoJSON || roadTypeGeoJSON || blockagesGeoJSON} />
      <MapClickHandler onClick={onMapClick} />
    </MapContainer>
  );
};

export default Map;

