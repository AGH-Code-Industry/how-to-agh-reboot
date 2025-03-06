'use client';
import { GeolocateControl, Map as MapLibre, MapRef, Marker } from 'react-map-gl/maplibre';

import type { GeolocateResultEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useState } from 'react';
import type { Source } from 'maplibre-gl';
import { polygon, point, booleanPointInPolygon } from '@turf/turf';

interface MapProps {
  onAGHLeaveOrEnter: (isOnAGH: boolean) => void;
}

export default function Map({ onAGHLeaveOrEnter }: MapProps) {
  const geoControlRef = useRef<maplibregl.GeolocateControl>(null);
  const mapRef = useRef<MapRef>(null);

  const aghBoundsPolygonRef = useRef<ReturnType<typeof polygon>>(null);

  const [isOnAGH, setIsOnAGH] = useState<boolean>();

  const handleMapLoad = () => {
    // Centrowanie kamery na pozycji użytkownika przy załadowaniu mapy
    geoControlRef.current?.trigger();

    // Stworzenie wielokąta wyznaczającego granice miasteczka
    const aghSource: (Source & { _data: { geometry: { coordinates: number[][][] } } }) | undefined =
      mapRef.current?.getSource('agh');

    if (aghSource && aghSource._data.geometry.coordinates[0]) {
      aghBoundsPolygonRef.current = polygon(aghSource._data.geometry.coordinates);
    }
  };

  const handleGeolocate = (e: GeolocateResultEvent) => {
    if (!aghBoundsPolygonRef.current) {
      return;
    }

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
        longitude: 19.908207508138602,
        latitude: 50.06807388275794,
        zoom: 17,
        pitch: 60,
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
      {/* Znaczniki testowe więc style inline */}
      <Marker longitude={19.904866064457725} latitude={50.06811457654741} color="red" />
      {/* Może być też zdjęcie jak poniżej */}
      <Marker longitude={19.907866664457725} latitude={50.06811457654741}>
        <img
          style={{ width: '100%' }}
          src="https://coin.agh.edu.pl/_next/image?url=%2Flogo.png&w=48&q=75"
          alt="coin-logo"
        />
      </Marker>
    </MapLibre>
  );
}
