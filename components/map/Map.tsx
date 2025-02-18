'use client';
import { GeolocateControl, Map as MapLibre, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef } from 'react';

export default function Map() {
  const geoControlRef = useRef<maplibregl.GeolocateControl>(null);

  const handleMapLoad = () => {
    geoControlRef.current?.trigger();
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
    >
      <GeolocateControl
        positionOptions={{
          enableHighAccuracy: true,
        }}
        trackUserLocation={true}
        ref={geoControlRef}
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
