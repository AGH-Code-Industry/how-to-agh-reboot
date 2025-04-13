import './MapEvents.scss';

import { useCallback, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';

import { Source, Layer, useMap } from 'react-map-gl/maplibre';
import { Popup } from 'maplibre-gl';

import { layer1, layer2, layer3, layer4 } from '../../data/layerConfig';
import MapPopup from './MapPopup';

import type { Point } from 'geojson';
import type MapLibreGl from 'maplibre-gl';
import { EventDTO } from '@/types/Event';
import { useSearchParams } from 'next/navigation';
import { useEventsStore } from '@/store/map/eventsStore';
import useGeoJsonData from '@/hooks/map/useGeoJsonData';

export default function MapEvents() {
  const eventList = useEventsStore((state) => state.eventsFiltered);
  const filterChangeCounter = useEventsStore((state) => state.filterChangeCounter);
  const { current: mapRef } = useMap();
  const popup = useRef<Popup>(null);
  const searchParams = useSearchParams();
  const geoJsonData = useGeoJsonData(eventList);

  const showEventPopup = useCallback((event: EventDTO, map: maplibregl.Map) => {
    popup.current?.remove();
    const html = renderToString(<MapPopup event={event} />);
    const newPopup = new Popup({ closeOnClick: true, offset: [0, -20] })
      .setLngLat([event.longitude, event.latidute])
      .setHTML(html)
      .addTo(map);
    popup.current = newPopup;
  }, []);

  /**
   * Handle click event on the map.
   * This function checks if the clicked feature is a cluster or an event.
   * If it's a cluster, it zooms in on the cluster.
   * If it's an event, it shows the event popup.
   * @param e - Map mouse event
   */
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

      popup.current?.remove();

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
    [mapRef, showEventPopup]
  );

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [handleClick, mapRef]);

  /**
   * Check if the URL contains an event ID and zoom to that event
   */
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
  }, [eventList, mapRef, searchParams, showEventPopup]);

  /**
   * Zoom to the bounds of all events
   */
  useEffect(() => {
    if (filterChangeCounter === 0) return;
    const map = mapRef?.getMap();
    if (!map) return;
    if (eventList.length === 0) return;

    if (eventList.length === 1) {
      const singleEvent = eventList[0];
      map.easeTo({
        center: [singleEvent.longitude, singleEvent.latidute],
        zoom: 18,
        duration: 600,
      });
      return;
    }

    const [minLng, minLat, maxLng, maxLat] = eventList.reduce(
      ([minLng, minLat, maxLng, maxLat], event) => [
        Math.min(minLng, event.longitude),
        Math.min(minLat, event.latidute),
        Math.max(maxLng, event.longitude),
        Math.max(maxLat, event.latidute),
      ],
      [180, 90, -180, -90]
    );

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
          bearing: -30,
        }
      );
    }
  }, [eventList, mapRef, filterChangeCounter]);

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
