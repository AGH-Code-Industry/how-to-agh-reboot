import './MapEvents.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';

import { Source, Layer, useMap } from 'react-map-gl/maplibre';
import { Popup } from 'maplibre-gl';

import { layer1, layer2, layer3 } from './layerConfig';
import MapPopup from './MapPopup';

import type { MapEvent } from '@/types/Map/MapEvent';
import type { FeatureCollection, Point } from 'geojson';
import type MapLibreGl from 'maplibre-gl';

type Props = {
  eventList: MapEvent[];
};

export default function MapEvents({ eventList }: Props) {
  const { current: mapRef } = useMap();
  const [popup, setPopup] = useState<Popup | null>(null);

  const geoJsonData = useMemo<FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: eventList.map((event) => ({
        type: 'Feature',
        properties: {
          cluster: false,
          ...event,
        },
        geometry: {
          type: 'Point',
          coordinates: [event.lng, event.ltd],
        },
      })),
    }),
    [eventList]
  );

  const handleClick = useCallback(
    async (e: MapLibreGl.MapMouseEvent) => {
      const map = mapRef?.getMap();
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [layer1.id, layer2.id],
      });

      if (!features.length) return;

      const feature = features[0];
      const coordinates = (feature.geometry as Point).coordinates as [number, number];

      popup?.remove();

      if (feature.properties?.cluster) {
        const clusterId = feature.properties.cluster_id;
        const source = map.getSource('events') as MapLibreGl.GeoJSONSource;

        const zoom = await source.getClusterExpansionZoom(clusterId);

        map.easeTo({
          center: coordinates,
          zoom,
          duration: 500,
        });
      } else {
        const props = feature.properties;
        const html = renderToString(<MapPopup event={props as MapEvent} />);

        const newPopup = new Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(map);
        setPopup(newPopup);
      }
    },
    [popup, mapRef]
  );

  useEffect(() => {
    const map = mapRef?.getMap();

    if (!map) return;

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [handleClick, mapRef]);

  return (
    <Source
      id="events"
      type="geojson"
      data={geoJsonData}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      <Layer {...layer1} />
      <Layer {...layer2} />
      <Layer {...layer3} />
    </Source>
  );
}
