import { useState, useEffect } from 'react';
import { checkServerReady } from '../services/api';

const ServerStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'ready' | 'wait' | 'error'>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isReady = await checkServerReady();
        setStatus(isReady ? 'ready' : 'wait');
      } catch (error) {
        console.error('Error checking server status:', error);
        setStatus('error');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return '#4caf50';
      case 'wait':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ready':
        return 'Server Ready';
      case 'wait':
        return 'Server Starting...';
      case 'error':
        return 'Server Error';
      default:
        return 'Checking...';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      right: '420px',
      zIndex: 1000,
      background: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
        }}
      />
      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{getStatusText()}</span>
    </div>
  );
};

export default ServerStatus;

