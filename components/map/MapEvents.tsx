import './MapEvents.scss';

import { useCallback, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import { Source, Layer, useMap } from 'react-map-gl/maplibre';
import { Popup } from 'maplibre-gl';

import { layer1, layer2, layer3, layer4 } from './layerConfig';
import MapPopup from './MapPopup';

import type { FeatureCollection, Point } from 'geojson';
import type MapLibreGl from 'maplibre-gl';
import { EventDTO } from '@/types/Event';
import { useSearchParams } from 'next/navigation';

type Props = {
  eventList: EventDTO[];
};

export default function MapEvents({ eventList }: Props) {
  const { current: mapRef } = useMap();
  const [popup, setPopup] = useState<Popup | null>(null);

  const searchParams = useSearchParams();

  const getGeoJsonData = useCallback<() => FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: eventList.map((event) => {
        const foundOccurrence = event.occurrences.find(
          (occurrence) => occurrence.end.getTime() > Date.now()
        );

        return {
          type: 'Feature',
          properties: {
            cluster: false,
            ...event,
            eventTypeImageID: event.eventType.id,
            start_time: foundOccurrence?.start.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            end_time: foundOccurrence?.end.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
          geometry: {
            type: 'Point',
            coordinates: [event.longitude, event.latidute],
          },
        };
      }),
    }),
    [eventList]
  );

  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection>(getGeoJsonData());

  useEffect(() => {
    setGeoJsonData(getGeoJsonData());
    const interval = setInterval(() => {
      setGeoJsonData(getGeoJsonData());
    }, 5000);

    return () => clearInterval(interval);
  }, [getGeoJsonData]);

  const showEventPopup = (event: EventDTO, map: maplibregl.Map) => {
    popup?.remove();

    const html = renderToString(<MapPopup event={event} />);

    const newPopup = new Popup({ closeOnClick: true, offset: [0, -20] })
      .setLngLat([event.longitude, event.latidute])
      .setHTML(html)
      .addTo(map);
    setPopup(newPopup);
  };

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
        props.eventType = JSON.parse(props.eventType as unknown as string);

        showEventPopup(props, map);
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

  useEffect(() => {
    const eventId = searchParams.get('event');

    if (!eventId || !mapRef) return;

    const event = eventList.find((event) => event.id === +eventId);

    if (event && mapRef) {
      mapRef.flyTo({
        center: [event.longitude, event.latidute],
        zoom: 17,
      });

      showEventPopup(event, mapRef.getMap());
    }
  }, [searchParams, eventList]);

  return (
    <Source
      id="events"
      type="geojson"
      data={geoJsonData}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={20}
    >
      <Layer {...layer1} />
      <Layer {...layer2} />
      <Layer {...layer4} />
      <Layer {...layer3} />
    </Source>
  );
}
