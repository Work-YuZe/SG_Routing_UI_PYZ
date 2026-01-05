import type { TravelMode, TravelModeConfig } from './api';

/**
 * Travel mode configurations
 * Each mode has specific road types that are allowed for routing
 */
export const TRAVEL_MODE_CONFIGS: Record<TravelMode, TravelModeConfig> = {
  car: {
    name: 'Car',
    icon: '🚗',
    roadTypes: [
      'primary',
      'secondary',
      'tertiary',
      'trunk',
      'motorway',
      'residential',
      'primary_link',
      'secondary_link',
      'tertiary_link',
      'motorway_link',
    ],
  },
  bicycle: {
    name: 'Bicycle',
    icon: '🚲',
    roadTypes: [
      'cycleway',
      'residential',
      'tertiary',
      'secondary',
    ],
  },
  walking: {
    name: 'Walking',
    icon: '🚶',
    roadTypes: [
      'footway',
      'path',
      'residential',
      'pedestrian',
    ],
  },
  bus: {
    name: 'Bus',
    icon: '🚌',
    roadTypes: [
      'primary',
      'secondary',
      'tertiary',
      'trunk',
      'motorway',
      'primary_link',
      'secondary_link',
      'tertiary_link',
      'motorway_link',
    ],
  },
};

