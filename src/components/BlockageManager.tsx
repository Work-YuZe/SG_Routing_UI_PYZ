import { useState } from 'react';
import type { BlockageRequest } from '../types/api';

interface Blockage {
  name: string;
  point: { long: number; lat: number };
  radius: number;
  description: string;
}

interface BlockageManagerProps {
  blockages: Blockage[];
  onAddBlockage: (blockage: BlockageRequest) => void;
  onDeleteBlockage: (name: string) => void;
  selectedPoint: { lat: number; lng: number } | null;
  onFormOpenChange?: (isOpen: boolean) => void;
}

const BlockageManager: React.FC<BlockageManagerProps> = ({
  blockages,
  onAddBlockage,
  onDeleteBlockage,
  selectedPoint,
  onFormOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onFormOpenChange) {
      onFormOpenChange(newState);
    }
  };
  const [name, setName] = useState('');
  const [radius, setRadius] = useState(200);
  const [description, setDescription] = useState('');

  const handleAddBlockage = () => {
    if (!selectedPoint) {
      alert('Please click on the map to select a location for the blockage');
      return;
    }
    if (!name.trim()) {
      alert('Please enter a name for the blockage');
      return;
    }

    const blockage: BlockageRequest = {
      point: {
        long: selectedPoint.lng,
        lat: selectedPoint.lat,
      },
      radius,
      name: name.trim(),
      description: description.trim(),
    };

    onAddBlockage(blockage);
    setName('');
    setDescription('');
    setRadius(200);
    setIsOpen(false);
    if (onFormOpenChange) {
      onFormOpenChange(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      zIndex: 1000,
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Blockages</h3>
        <button
          onClick={handleToggle}
          style={{
            padding: '5px 10px',
            backgroundColor: '#3388ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isOpen ? 'Close' : 'Add Blockage'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              placeholder="Blockage name"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Radius (meters)
            </label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{ width: '100%', padding: '5px' }}
              min="1"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '5px', minHeight: '60px' }}
              placeholder="Blockage description"
            />
          </div>
          {selectedPoint ? (
            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
              Location: {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
              <br />
              <span style={{ fontStyle: 'italic' }}>Click on map to change location</span>
            </div>
          ) : (
            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#ff0000' }}>
              Please click on the map to select a location
            </div>
          )}
          <button
            onClick={handleAddBlockage}
            disabled={!selectedPoint || !name.trim()}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: selectedPoint && name.trim() ? '#3388ff' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedPoint && name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Add Blockage
          </button>
        </div>
      )}

      <div>
        <strong>Existing Blockages ({blockages.length})</strong>
        {blockages.length === 0 ? (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
            No blockages
          </div>
        ) : (
          <div style={{ marginTop: '10px' }}>
            {blockages.map((blockage) => (
              <div
                key={blockage.name}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{blockage.name}</div>
                {blockage.description && (
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    {blockage.description}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>
                  Radius: {blockage.radius}m
                </div>
                <button
                  onClick={() => onDeleteBlockage(blockage.name)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockageManager;

