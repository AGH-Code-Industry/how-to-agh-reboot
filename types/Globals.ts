import maplibregl from 'maplibre-gl';

declare global {
  interface Window {
    mapInstance?: maplibregl.Map;
  }
}
