import './MapEvents.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';

import { Source, Layer, useMap } from 'react-map-gl/maplibre';
import { Popup } from 'maplibre-gl';

import { layer1, layer2, layer3 } from './layerConfig';
import MapPopup from './MapPopup';

import type { FeatureCollection, Point } from 'geojson';
import type MapLibreGl from 'maplibre-gl';
import { EventDTO } from '@/types/Event';

type Props = {
  eventList: EventDTO[];
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
          coordinates: [event.longitude, event.latidute],
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
        const props = feature.properties as EventDTO;
        props.building = JSON.parse(props.building as unknown as string);
        props.fieldOfStudy = JSON.parse(props.fieldOfStudy as unknown as string);
        props.occurrences = JSON.parse(props.occurrences as unknown as string);

        const html = renderToString(<MapPopup event={props} />);

        const newPopup = new Popup({ closeOnClick: true, offset: [0, -20] })
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
