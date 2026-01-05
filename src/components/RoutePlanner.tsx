import { useState } from 'react';
import type { Point } from '../types/api';

interface RoutePlannerProps {
  onRouteRequest: (startPt: Point, endPt: Point) => void;
  startPoint: Point | null;
  endPoint: Point | null;
  onStartPointChange: (point: Point | null) => void;
  onEndPointChange: (point: Point | null) => void;
  loading?: boolean;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({
  onRouteRequest,
  startPoint,
  endPoint,
  onStartPointChange,
  onEndPointChange,
  loading = false,
}) => {
  const [startDesc, setStartDesc] = useState('');
  const [endDesc, setEndDesc] = useState('');

  const handleCalculateRoute = () => {
    if (startPoint && endPoint) {
      const start: Point = {
        ...startPoint,
        description: startDesc || undefined,
      };
      const end: Point = {
        ...endPoint,
        description: endDesc || undefined,
      };
      onRouteRequest(start, end);
    }
  };

  const handleClearStart = () => {
    onStartPointChange(null);
    setStartDesc('');
  };

  const handleClearEnd = () => {
    onEndPointChange(null);
    setEndDesc('');
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '300px',
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Route Planner</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Start Point
        </label>
        {startPoint ? (
          <div style={{ marginBottom: '5px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {startPoint.lat.toFixed(6)}, {startPoint.long.toFixed(6)}
            </div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={startDesc}
              onChange={(e) => setStartDesc(e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
            <button
              onClick={handleClearStart}
              style={{ marginTop: '5px', padding: '5px 10px', fontSize: '12px' }}
            >
              Clear Start
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
            Click on map to set start point
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          End Point
        </label>
        {endPoint ? (
          <div style={{ marginBottom: '5px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {endPoint.lat.toFixed(6)}, {endPoint.long.toFixed(6)}
            </div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={endDesc}
              onChange={(e) => setEndDesc(e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
            <button
              onClick={handleClearEnd}
              style={{ marginTop: '5px', padding: '5px 10px', fontSize: '12px' }}
            >
              Clear End
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
            Click on map to set end point
          </div>
        )}
      </div>

      <button
        onClick={handleCalculateRoute}
        disabled={!startPoint || !endPoint || loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: startPoint && endPoint ? '#3388ff' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: startPoint && endPoint ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Calculating...' : 'Calculate Route'}
      </button>
    </div>
  );
};

export default RoutePlanner;

