import { LayerProps } from 'react-map-gl/maplibre';

export const layer1 = {
  id: 'clusters',
  type: 'circle',
  filter: ['has', 'point_count'],
  source: 'events',
  paint: {
    'circle-color': '#fff',
    'circle-radius': ['step', ['get', 'point_count'], 20, 20, 35, 30, 50],
    'circle-stroke-width': 1.3,
    'circle-stroke-color': '#000',
  },
} satisfies LayerProps;

export const layer2 = {
  id: 'unclustered-point',
  type: 'symbol',
  filter: ['!', ['has', 'point_count']],
  source: 'events',
  layout: {
    'icon-image': 'event_type_{eventType}',
    'icon-size': 0.7,
    'icon-allow-overlap': true,
  },
} satisfies LayerProps;

export const layer3 = {
  id: 'cluster-count',
  type: 'symbol',
  filter: ['has', 'point_count'],
  source: 'events',
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
    'text-font': ['Noto Sans Regular'],
  },
} satisfies LayerProps;

export const layer4 = {
  id: 'event-time',
  type: 'symbol',
  filter: ['all', ['has', 'start_time'], ['has', 'end_time']], // Added condition for both start_time and end_time
  source: 'events',
  layout: {
    'text-field': '{start_time} - {end_time}', // Display both start and end times
    'text-size': 12,
    'text-font': ['Noto Sans Bold'], // Changed to bold for thicker text
    'icon-allow-overlap': true,
    'text-offset': [0, -2.2],
  },
  paint: {
    'text-halo-color': '#000000',
    'text-halo-width': 2, // Disable halo for rectangular background
    'text-halo-blur': 0,
    'text-color': '#ffffff',
  },
} satisfies LayerProps;
