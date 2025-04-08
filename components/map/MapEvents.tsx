import './MapEvents.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';

import { Source, Layer, useMap } from 'react-map-gl/maplibre';
import { Popup } from 'maplibre-gl';

import { layer1, layer2, layer3, layer4 } from './layerConfig';
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
          start_time: new Date(event.occurrences[0].start).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          end_time: new Date(event.occurrences[0].end).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        geometry: {
          type: 'Point',
          coordinates: [event.longitude, event.latitude],
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
        layers: [layer1.id, layer2.id, layer3.id, layer4.id],
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

  // ------------- NOWY useEffect - dopasowanie widoku do przefiltrowanych eventów -------------
  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    // Brak eventów – nie robimy nic
    if (eventList.length === 0) return;

    // Jeśli jest dokładnie jedno wydarzenie, przybliżamy się na nie
    if (eventList.length === 1) {
      const singleEvent = eventList[0];
      map.easeTo({
        center: [singleEvent.longitude, singleEvent.latitude],
        zoom: 18, // lub inny docelowy zoom
        duration: 600,
      });
      return;
    }

    // W innym wypadku (więcej niż 1 event) ustawiamy bounding box
    const [minLng, minLat, maxLng, maxLat] = eventList.reduce(
      ([minLng, minLat, maxLng, maxLat], event) => [
        Math.min(minLng, event.longitude),
        Math.min(minLat, event.latitude),
        Math.max(maxLng, event.longitude),
        Math.max(maxLat, event.latitude),
      ],
      [180, 90, -180, -90]
    );

    // Jeśli bounding box sprowadza się do jednego punktu (te same współrzędne)
    if (minLng === maxLng && minLat === maxLat) {
      map.easeTo({
        center: [minLng, minLat],
        zoom: 14,
        duration: 600,
      });
    } else {
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 50,
          duration: 600,
        }
      );
    }
  }, [eventList, mapRef]);

  // ------------------------------------------------------------------------------------------

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
      <Layer {...layer4} />
    </Source>
  );
}
