'use client';
import { GeolocateControl, Map as MapLibre, MapRef } from 'react-map-gl/maplibre';

import type { GeolocateResultEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import type { Source as SourceType } from 'maplibre-gl';
import MapEvents from '@/components/map/MapEvents';
import { polygon, point, booleanPointInPolygon } from '@turf/turf';
import { EventDTO } from '@/types/Event';
import CampMarker from './CampMarker';
import { useSearchParams } from 'next/navigation';
import RewardMarker from './RewardMarker';

type Props = {
  eventList: EventDTO[];
  onAGHLeaveOrEnter: (isOnAGH: boolean) => void;
  ref: (arg0: MapRef) => void;
};

export default function Map(props: Props) {
  const geoControlRef = useRef<maplibregl.GeolocateControl>(null);
  const mapRef = useRef<MapRef>(null);

  const campCoordinatesRef = useRef<[number, number]>([19.921339, 50.065236]);

  const aghBoundsPolygonRef = useRef<ReturnType<typeof polygon>>(null);

  const [isOnAGH, setIsOnAGH] = useState<boolean>();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (mapRef.current) {
      props.ref(mapRef.current);
    }
  }, [mapRef.current]);

  const handleMapLoad = async () => {
    if (!searchParams.get('event')) {
      // Centrowanie kamery na pozycji użytkownika przy załadowaniu mapy
      geoControlRef.current?.trigger();
    }

    if (!mapRef.current) {
      return;
    }

    // Stworzenie wielokąta wyznaczającego granice miasteczka
    const aghSource:
      | (SourceType & { _data: { geometry: { coordinates: number[][][] } } })
      | undefined = mapRef.current?.getSource('agh');

    if (aghSource && aghSource._data.geometry.coordinates[0]) {
      aghBoundsPolygonRef.current = polygon(aghSource._data.geometry.coordinates);
    }

    const logoImage = await mapRef.current.loadImage('./images/logo.webp');
    mapRef.current.addImage('coin', logoImage.data);

    const lectureImage = await mapRef.current.loadImage('./images/eventTypes/Wykład.webp');
    mapRef.current.addImage('event_type_1', lectureImage.data);

    const labsImage = await mapRef.current.loadImage('./images/eventTypes/Laboratorium.webp');
    mapRef.current.addImage('event_type_2', labsImage.data);

    const exhibitionImage = await mapRef.current.loadImage('./images/eventTypes/Wystawa.webp');
    mapRef.current.addImage('event_type_3', exhibitionImage.data);

    const standImage = await mapRef.current.loadImage('./images/eventTypes/Stoisko.webp');
    mapRef.current.addImage('event_type_4', standImage.data);
  };

  const handleGeolocate = (e: GeolocateResultEvent) => {
    if (!aghBoundsPolygonRef.current) {
      return;
    }

    const { onAGHLeaveOrEnter } = props;

    // Sprawdzanie, czy pozycja użytkownika znajduje się w wielokącie opisującym miasteczko
    const currentPosition = point([e.coords.longitude, e.coords.latitude]);

    const isCurrentlyOnAGH = booleanPointInPolygon(currentPosition, aghBoundsPolygonRef.current);

    if (isCurrentlyOnAGH !== isOnAGH) {
      onAGHLeaveOrEnter(isCurrentlyOnAGH);
      setIsOnAGH(isCurrentlyOnAGH);
    }
  };

  return (
    <MapLibre
      // Komponent nie przyjmuje className
      style={{
        height: '100%',
      }}
      initialViewState={{
        longitude: campCoordinatesRef.current[0],
        latitude: campCoordinatesRef.current[1],
        zoom: 17,
        pitch: 50,
        bearing: -30,
      }}
      // Zablokowałem pochylanie góra dół przy obracaniu, do przemyślenia czy chcemy to włączone
      pitchWithRotate={false}
      // Styl mapy można edytować np przy użyciu tego https://maputnik.github.io/
      mapStyle={'/map-tiles.json'}
      onLoad={handleMapLoad}
      ref={mapRef}
    >
      <GeolocateControl
        positionOptions={{
          enableHighAccuracy: true,
        }}
        trackUserLocation={true}
        ref={geoControlRef}
        onGeolocate={handleGeolocate}
      />
      <CampMarker coordinates={campCoordinatesRef.current} />
      <RewardMarker />
      <MapEvents eventList={props.eventList} />
    </MapLibre>
  );
}
