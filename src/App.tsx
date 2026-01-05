import { useState, useEffect } from 'react';
import Map from './components/Map';
import RoutePlanner from './components/RoutePlanner';
import RoadTypeViewer from './components/RoadTypeViewer';
import BlockageManager from './components/BlockageManager';
import ServerStatus from './components/ServerStatus';
import {
  getRoute,
  getAllBlockages,
  addBlockage,
  deleteBlockage,
} from './services/api';
import type { Point, GeoJSON, BlockageRequest } from './types/api';
import './App.css';

// Singapore center coordinates
const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];

function App() {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON | null>(null);
  const [roadTypeGeoJSON, setRoadTypeGeoJSON] = useState<GeoJSON | null>(null);
  const [blockagesGeoJSON, setBlockagesGeoJSON] = useState<GeoJSON | null>(null);
  const [selectedBlockagePoint, setSelectedBlockagePoint] = useState<{ lat: number; lng: number } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [blockages, setBlockages] = useState<any[]>([]);
  const [blockageFormOpen, setBlockageFormOpen] = useState(false);

  // Load blockages on mount
  useEffect(() => {
    const loadBlockages = async () => {
      try {
        const geoJSON = await getAllBlockages();
        setBlockagesGeoJSON(geoJSON);
        
        // Extract blockage list from GeoJSON
        if (geoJSON.features && Array.isArray(geoJSON.features)) {
          const blockageList = geoJSON.features.map((feature) => {
            try {
              const props = feature.properties || {};
              // Blockages come as Point geometry
              let coords: number[] = [0, 0];
              if (feature.geometry.type === 'Point') {
                coords = feature.geometry.coordinates as unknown as number[];
              }
              
              return {
                name: props.name || 'Unknown',
                point: {
                  long: coords[0],
                  lat: coords[1],
                },
                radius: props["distance (meters)"] ?? 200,
                description: props.description || '',
              };
            } catch (error) {
              console.error('Error processing blockage feature:', error, feature);
              return null;
            }
          }).filter((b): b is NonNullable<typeof b> => b !== null);
          
          setBlockages(blockageList);
        } else {
          setBlockages([]);
        }
      } catch (error) {
        console.error('Error loading blockages:', error);
        // Don't show error to user on initial load - server might not be ready yet
      }
    };
    
    // Wait a bit before loading blockages to let server initialize
    const timer = setTimeout(() => {
      loadBlockages();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (blockageFormOpen) {
      // If blockage form is open, set blockage location
      setSelectedBlockagePoint({ lat, lng });
    } else {
      // Otherwise, set route points
      // If both points are set, clicking sets new start point (allows re-setting)
      if (!startPoint || (startPoint && endPoint)) {
        setStartPoint({ lat, long: lng });
        if (endPoint) {
          // Clear end point when setting new start
          setEndPoint(null);
          setRouteGeoJSON(null); // Clear route when resetting
        }
      } else if (!endPoint) {
        setEndPoint({ lat, long: lng });
      }
    }
  };

  const handleRouteRequest = async (startPt: Point, endPt: Point) => {
    setRouteLoading(true);
    try {
      const geoJSON = await getRoute({ startPt, endPt });
      setRouteGeoJSON(geoJSON);
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try again.');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleAddBlockage = async (blockage: BlockageRequest) => {
    try {
      await addBlockage(blockage);
      // Reload blockages
      const geoJSON = await getAllBlockages();
      console.log('Reloaded blockages after add:', geoJSON);
      
      // Validate GeoJSON structure
      if (!geoJSON || typeof geoJSON !== 'object') {
        console.error('Invalid GeoJSON response:', geoJSON);
        alert('Failed to reload blockages. Invalid response from server.');
        return;
      }

      setBlockagesGeoJSON(geoJSON);
      
      if (geoJSON.features && Array.isArray(geoJSON.features)) {
        const blockageList = geoJSON.features.map((feature) => {
          try {
            const props = feature.properties || {};
            let coords: number[] = [0, 0];
            if (feature.geometry.type === 'Point') {
              coords = feature.geometry.coordinates as unknown as number[];
            } else if (feature.geometry.type === 'Polygon') {
              const polygonCoords = feature.geometry.coordinates as unknown as number[][][];
              if (polygonCoords[0] && polygonCoords[0].length > 0) {
                // Calculate center point of polygon
                let sumLng = 0, sumLat = 0, count = 0;
                polygonCoords[0].forEach((coord) => {
                  if (coord && coord.length >= 2 && isFinite(coord[0]) && isFinite(coord[1])) {
                    sumLng += coord[0];
                    sumLat += coord[1];
                    count++;
                  }
                });
                if (count > 0) {
                  coords = [sumLng / count, sumLat / count];
                }
              }
            }
            
            return {
              name: props.name || 'Unknown',
              point: {
                long: coords[0],
                lat: coords[1],
              },
              radius: props["distance (meters)"] ?? 200,
              description: props.description || '',
            };
          } catch (error) {
            console.error('Error processing blockage feature:', error, feature);
            return null;
          }
        }).filter((b): b is NonNullable<typeof b> => b !== null);
        
        setBlockages(blockageList);
      } else {
        setBlockages([]);
      }
    } catch (error) {
      console.error('Error adding blockage:', error);
      alert('Failed to add blockage. Please try again.');
    }
  };

  const handleDeleteBlockage = async (name: string) => {
    console.log('handleDeleteBlockage called with name:', name);
    try {
      await deleteBlockage(name);
      console.log('Blockage deleted successfully, reloading...');
      
      // Reload blockages
      const geoJSON = await getAllBlockages();
      console.log('Reloaded blockages after delete:', geoJSON);
      
      // Validate GeoJSON structure
      if (!geoJSON || typeof geoJSON !== 'object') {
        console.error('Invalid GeoJSON response:', geoJSON);
        alert('Failed to reload blockages. Invalid response from server.');
        return;
      }

      // Always update the GeoJSON state (even if empty)
      setBlockagesGeoJSON(geoJSON);
      
      // Process blockage list
      if (geoJSON.features && Array.isArray(geoJSON.features)) {
        const blockageList = geoJSON.features.map((feature) => {
          try {
            const props = feature.properties || {};
            let coords: number[] = [0, 0];
            if (feature.geometry.type === 'Point') {
              coords = feature.geometry.coordinates as unknown as number[];
            } else if (feature.geometry.type === 'Polygon') {
              const polygonCoords = feature.geometry.coordinates as unknown as number[][][];
              if (polygonCoords[0] && polygonCoords[0].length > 0) {
                // Calculate center point of polygon
                let sumLng = 0, sumLat = 0, count = 0;
                polygonCoords[0].forEach((coord) => {
                  if (coord && coord.length >= 2 && isFinite(coord[0]) && isFinite(coord[1])) {
                    sumLng += coord[0];
                    sumLat += coord[1];
                    count++;
                  }
                });
                if (count > 0) {
                  coords = [sumLng / count, sumLat / count];
                }
              }
            }
            
            return {
              name: props.name || 'Unknown',
              point: {
                long: coords[0],
                lat: coords[1],
              },
              radius: props["distance (meters)"] ?? 200,
              description: props.description || '',
            };
          } catch (error) {
            console.error('Error processing blockage feature:', error, feature);
            return null;
          }
        }).filter((b): b is NonNullable<typeof b> => b !== null);
        
        console.log('Setting blockage list to:', blockageList);
        setBlockages(blockageList);
      } else {
        // No features means no blockages - explicitly set empty array
        console.log('No features found, setting empty blockage list');
        setBlockages([]);
      }
    } catch (error: any) {
      console.error('Error deleting blockage:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      const errorStatus = error?.response?.status;
      console.error('Error details - Status:', errorStatus, 'Message:', errorMessage);
      alert(`Failed to delete blockage: ${errorMessage || 'Please try again.'}`);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Map
        center={SINGAPORE_CENTER}
        zoom={12}
        routeGeoJSON={routeGeoJSON}
        roadTypeGeoJSON={roadTypeGeoJSON}
        blockagesGeoJSON={blockagesGeoJSON}
        startPoint={startPoint}
        endPoint={endPoint}
        onMapClick={handleMapClick}
      />

      <RoutePlanner
        onRouteRequest={handleRouteRequest}
        startPoint={startPoint}
        endPoint={endPoint}
        onStartPointChange={setStartPoint}
        onEndPointChange={setEndPoint}
        loading={routeLoading}
      />

      <RoadTypeViewer
        onRoadTypeSelect={setRoadTypeGeoJSON}
      />

      <BlockageManager
        blockages={blockages}
        onAddBlockage={handleAddBlockage}
        onDeleteBlockage={handleDeleteBlockage}
        selectedPoint={selectedBlockagePoint}
        onFormOpenChange={setBlockageFormOpen}
      />

      <ServerStatus />
    </div>
  );
}

export default App;

