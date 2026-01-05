import { useState, useEffect } from 'react';
import { getAllRoadTypes, getRoadTypeGeoJSON } from '../services/api';
import type { GeoJSON } from '../types/api';

interface RoadTypeViewerProps {
  onRoadTypeSelect: (geoJSON: GeoJSON | null) => void;
}

const RoadTypeViewer: React.FC<RoadTypeViewerProps> = ({ onRoadTypeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roadTypes, setRoadTypes] = useState<string[]>([]);
  const [selectedRoadType, setSelectedRoadType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoadTypes = async () => {
      try {
        const types = await getAllRoadTypes();
        setRoadTypes(types);
      } catch (error) {
        console.error('Error fetching road types:', error);
      }
    };
    fetchRoadTypes();
  }, []);

  const handleRoadTypeSelect = async (roadType: string) => {
    if (selectedRoadType === roadType) {
      // Deselect if clicking the same road type
      setSelectedRoadType(null);
      onRoadTypeSelect(null);
      return;
    }

    setLoading(true);
    setSelectedRoadType(roadType);
    try {
      const geoJSON = await getRoadTypeGeoJSON(roadType);
      onRoadTypeSelect(geoJSON);
    } catch (error) {
      console.error('Error fetching road type GeoJSON:', error);
      alert('Failed to load road type data');
      setSelectedRoadType(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '320px',
      zIndex: 1000,
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Road Types</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#3388ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <div style={{ 
          overflowY: 'auto', 
          overflowX: 'hidden',
          maxHeight: '500px',
          flex: 1,
        }}>
          {loading && <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>Loading...</div>}
          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
            Select a road type to view on the map:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {roadTypes.map((roadType) => (
              <button
                key={roadType}
                onClick={() => handleRoadTypeSelect(roadType)}
                style={{
                  padding: '8px',
                  backgroundColor: selectedRoadType === roadType ? '#3388ff' : '#f0f0f0',
                  color: selectedRoadType === roadType ? 'white' : 'black',
                  border: `1px solid ${selectedRoadType === roadType ? '#3388ff' : '#ddd'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                {roadType}
              </button>
            ))}
          </div>
          {selectedRoadType && (
            <button
              onClick={() => {
                setSelectedRoadType(null);
                onRoadTypeSelect(null);
              }}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Clear Selection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadTypeViewer;
