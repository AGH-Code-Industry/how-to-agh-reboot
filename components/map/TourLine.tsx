import { MapEvent } from '@/types/Map/MapEvent';
import { GeoJSONSource, Map, LayerSpecification, GeoJSONSourceSpecification } from 'maplibre-gl';
import { useEffect, useState } from 'react';

const getLayerConfig = (
  sourceId: string,
  color: string,
  lineWidth: number,
  opacity: number,
  minZoom: number = 15,
  maxZoom: number = 0
): LayerSpecification => ({
  id: `${sourceId}-layer`,
  type: 'line',
  source: sourceId,
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': color,
    'line-width': lineWidth,
    'line-opacity': opacity,
  },
  minzoom: minZoom,
  maxzoom: maxZoom,
});

const getSourceConfig = (events: MapEvent[]): GeoJSONSourceSpecification => ({
  type: 'geojson',
  data: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: events.map((event) => [event.lng, event.ltd]),
    },
  },
});

function TourLine({
  map,
  events,
  color = '#000000',
  lineWidth = 18,
  opacity = 0.5,
}: {
  map?: Map;
  events: MapEvent[];
  color?: string;
  lineWidth?: number;
  opacity?: number;
}) {
  const [sourceId, setSourceId] = useState<string>();

  useEffect(() => {
    const cleanUp = (map: Map, sourceId?: string) => () => {
      if (!sourceId) {
        return;
      }
      map.removeLayer(`${sourceId}-layer`);
      map.removeSource(sourceId);
    };

    if (!map) {
      return;
    }

    if (sourceId) {
      cleanUp(map, sourceId)();
    }

    const newSourceId = `line-${Date.now()}`;
    setSourceId(newSourceId);

    map.addSource(newSourceId, getSourceConfig(events));

    map.addLayer(getLayerConfig(newSourceId, color, lineWidth, opacity), 'clusters');

    return cleanUp(map, sourceId);
  }, [map]);

  useEffect(() => {
    if (!map || !sourceId) {
      return;
    }

    map.removeLayer(`${sourceId}-layer`);

    map.addLayer(getLayerConfig(sourceId, color, lineWidth, opacity));
  }, [color, lineWidth, opacity]);

  useEffect(() => {
    if (!sourceId) {
      return;
    }

    const coordinates = events.map((event) => [event.lng, event.ltd]);

    const source: GeoJSONSource | undefined = map?.getSource(sourceId);
    if (!source) {
      return;
    }
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    });
  }, [events]);
  return <></>;
}

export default TourLine;
