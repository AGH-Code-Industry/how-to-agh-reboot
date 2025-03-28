import { LayerProps } from 'react-map-gl/maplibre';

export const layer1 = {
  id: 'clusters',
  type: 'circle',
  filter: ['has', 'point_count'],
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
  layout: {
    'icon-image': 'coin',
    'icon-size': 0.8,
    'icon-allow-overlap': true,
  },
} satisfies LayerProps;

export const layer3 = {
  id: 'cluster-count',
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
    'text-font': ['Noto Sans Regular'],
  },
} satisfies LayerProps;
